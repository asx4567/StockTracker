import yfinance as yf
import psycopg2
from psycopg2.extras import execute_values
import hashlib
import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DB_URL = os.getenv("SUPABASE_DATABASE_URL")

def compute_ohlcv_hash(symbol, date, open_p, high, low, close, volume):
    """Matches the Node.js/TypeScript hashing logic."""
    payload = f"{symbol}|{date}|{float(open_p)}|{float(high)}|{float(low)}|{float(close)}|{int(volume)}"
    return hashlib.md5(payload.encode()).hexdigest()

def calculate_indicators(df):
    """Adds DMA, RSI, and MACD to the dataframe."""
    if len(df) < 2:
        return df

    # DMA (Simple Moving Averages)
    df['dma_20'] = df['Close'].rolling(window=20).mean()
    df['dma_50'] = df['Close'].rolling(window=50).mean()
    df['dma_100'] = df['Close'].rolling(window=100).mean()
    df['dma_200'] = df['Close'].rolling(window=200).mean()

    # RSI (Relative Strength Index)
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['rsi_14'] = 100 - (100 / (1 + rs))

    # MACD
    exp12 = df['Close'].ewm(span=12, adjust=False).mean()
    exp26 = df['Close'].ewm(span=26, adjust=False).mean()
    df['macd_line'] = exp12 - exp26
    df['macd_signal'] = df['macd_line'].ewm(span=9, adjust=False).mean()
    df['macd_hist'] = df['macd_line'] - df['macd_signal']

    # Replace NaN with None (for SQL NULL)
    return df.replace({np.nan: None})

def sync_stocks(period="1y"):
    if not DB_URL:
        print("Error: SUPABASE_DATABASE_URL not found in environment")
        return

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # 1. Get all symbols and their last sync date
        cur.execute("""
            SELECT s.symbol, MAX(p.date) as last_date 
            FROM stocks s
            LEFT JOIN stock_prices p ON s.symbol = p.symbol
            GROUP BY s.symbol;
        """)
        stocks_meta = cur.fetchall()
        print(f"Syncing {len(stocks_meta)} symbols (Smart Window Mode)...")

        today = datetime.now().date()

        for symbol, last_date in stocks_meta:
            try:
                # 2. Determine fetch window
                # If last_date is today, we might still want to fetch if markets are open, 
                # but usually we skip if we already have today's data.
                # if last_date == today:
                #     print(f"SKIP {symbol}: Already up to date ({last_date}).")
                #     continue

                # To calculate DMA 200, we need at least 200 trading days.
                # We fetch 1 year (365 days / 250+ trading days) to be safe and fulfill 1-year history requirement.
                # If we have a massive gap or it's a new symbol, we do 1y.
                # If it's a daily update, we still fetch 1y because indicator calculation requires the series.
                # BUT we only upsert what's needed or missing.
                
                ticker = yf.Ticker(symbol)
                
                # We fetch 1y which is the "Initial Requirement" for backfill coverage,
                # but it also serves as our "Indicator Buffer" for daily maintenance.
                print(f"FETCH {symbol}: Fetching window '{period}' for indicators (Last sync: {last_date or 'Never'})...")
                hist = ticker.history(period=period, auto_adjust=False)

                if hist.empty:
                    continue

                # 3. Add Indicators
                hist = calculate_indicators(hist)

                # 4. Filter for new/missing data to minimize DB operations
                # We iterate over the fetched history and only keep rows newer than what we have
                # OR rows that might have changed (gap filling).
                rows = []
                for date, row in hist.iterrows():
                    current_date = date.date()
                    
                    # Optional: Optimization - only process if row is new OR within a small window
                    # for potential data corrections from Yahoo.
                    # For now, we process the whole 1y to ensure indicators are recalculated/refreshed.
                    
                    date_str = current_date.strftime('%Y-%m-%d')
                    ohlcv_hash = compute_ohlcv_hash(
                        symbol, date_str, row['Open'], row['High'], row['Low'], row['Close'], row['Volume']
                    )
                    
                    rows.append((
                        symbol, date_str, float(row['Open']), float(row['High']), float(row['Low']),
                        float(row['Close']), int(row['Volume']), ohlcv_hash,
                        row['dma_20'], row['dma_50'], row['dma_100'], row['dma_200'], 
                        row['rsi_14'], row['macd_line'], row['macd_signal'], row['macd_hist']
                    ))

                # 5. Bulk Upsert with Change Detection
                upsert_query = """
                INSERT INTO stock_prices (
                    symbol, date, open, high, low, close, volume, ohlcv_hash,
                    dma_20, dma_50, dma_100, dma_200, rsi_14, macd_line, macd_signal, macd_hist
                )
                VALUES %s
                ON CONFLICT (symbol, date) DO UPDATE 
                SET 
                    open = EXCLUDED.open, high = EXCLUDED.high, low = EXCLUDED.low,
                    close = EXCLUDED.close, volume = EXCLUDED.volume, ohlcv_hash = EXCLUDED.ohlcv_hash,
                    dma_20 = EXCLUDED.dma_20, dma_50 = EXCLUDED.dma_50, dma_100 = EXCLUDED.dma_100, dma_200 = EXCLUDED.dma_200,
                    rsi_14 = EXCLUDED.rsi_14, macd_line = EXCLUDED.macd_line, 
                    macd_signal = EXCLUDED.macd_signal, macd_hist = EXCLUDED.macd_hist
                WHERE stock_prices.ohlcv_hash != EXCLUDED.ohlcv_hash OR stock_prices.dma_100 IS NULL;
                """
                
                if rows:
                    execute_values(cur, upsert_query, rows)
                    conn.commit()
                    print(f"DONE {symbol}: Sync complete.")
                else:
                    print(f"SKIP {symbol}: No new data to upsert.")

            except Exception as e:
                print(f"ERROR syncing {symbol}: {e}")
                conn.rollback()

        cur.close()
        
        # 6. Refresh Materialized Views
        print("Refreshing materialized views...")
        with conn.cursor() as cur:
            cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_crashing_market")
        conn.commit()
        
        conn.close()
        print("Smart Sync Complete!")

    except Exception as e:
        print(f"Global sync failure: {e}")

if __name__ == "__main__":
    sync_stocks(period="5d")
