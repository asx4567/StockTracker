import os
import psycopg2
from dotenv import load_dotenv
from datetime import datetime, timedelta
import pandas as pd

load_dotenv("d:/Projects/MK Stock/.env")

def get_db_connection():
    db_url = os.getenv("SUPABASE_DATABASE_URL")
    return psycopg2.connect(db_url)

def backtest_strategy(days_back=60):
    conn = get_db_connection()
    try:
        # 1. Get all trading dates in the last N days
        with conn.cursor() as cur:
            cur.execute("""
                SELECT DISTINCT date 
                FROM stock_prices 
                ORDER BY date DESC 
                LIMIT %s
            """, (days_back,))
            all_dates = [row[0] for row in cur.fetchall()]
            all_dates.reverse() # Oldest to newest
            
        results = []
        
        print(f"Starting backtest across {len(all_dates)} trading days...")
        
        for sim_date in all_dates:
            # sim_date is the "current date" in our simulation
            
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                # Optimized Selection Query (Parameterized by sim_date)
                query = """
                WITH Candidates AS (
                    SELECT p.symbol, s.name, p.close as current_price, p.date as sim_date,
                           p.dma_50, p.dma_100, p.dma_200
                    FROM stock_prices p
                    JOIN stocks s ON p.symbol = s.symbol
                    WHERE p.date = %s
                      AND s.type = 'EQUITY'
                      AND p.close > p.dma_50 
                      AND p.close > p.dma_100 
                      AND p.close > p.dma_200
                ),
                HighDates AS (
                    SELECT c.symbol, c.name, sim_date, current_price, MAX(p2.close) as high_price
                    FROM Candidates c
                    JOIN stock_prices p2 ON c.symbol = p2.symbol
                    WHERE p2.date >= sim_date - INTERVAL '365 days' AND p2.date <= sim_date
                    GROUP BY c.symbol, c.name, sim_date, current_price
                ),
                HighDateDetails AS (
                    SELECT h.symbol, h.name, sim_date, h.current_price, h.high_price, 
                           MAX(p3.date) as high_date
                    FROM HighDates h
                    JOIN stock_prices p3 ON h.symbol = p3.symbol AND h.high_price = p3.close
                    WHERE p3.date >= sim_date - INTERVAL '365 days' AND p3.date <= sim_date
                    GROUP BY h.symbol, h.name, sim_date, h.current_price, h.high_price
                ),
                RunningAverages AS (
                    SELECT h.symbol, h.name, sim_date, h.current_price, p.date, p.close,
                           AVG(p.close) OVER (PARTITION BY h.symbol ORDER BY p.date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cum_avg
                    FROM HighDateDetails h
                    JOIN stock_prices p ON h.symbol = p.symbol
                    WHERE p.date >= h.high_date AND p.date <= sim_date
                ),
                TrendCheck AS (
                    SELECT symbol, name, cum_avg, sim_date, current_price,
                           LAG(cum_avg) OVER (PARTITION BY symbol ORDER BY date) as prev_cum_avg,
                           ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY date DESC) as rank_desc
                    FROM RunningAverages
                ),
                FinalSelection AS (
                    SELECT symbol, name, sim_date, current_price
                    FROM TrendCheck
                    WHERE rank_desc <= 10
                    GROUP BY symbol, name, sim_date, current_price
                    HAVING COUNT(*) FILTER (WHERE cum_avg > prev_cum_avg) = 10
                       AND COUNT(*) = 10
                )
                SELECT * FROM FinalSelection;
                """
                cur.execute(query, (sim_date,))
                selections = cur.fetchall()
                
                for pick in selections:
                    # For each pick, calculate performance over next 10, 20, 30 days
                    # Find price 10, 20, 30 trading days after sim_date
                    performance = {"symbol": pick['symbol'], "date": pick['sim_date'], "entry": float(pick['current_price'])}
                    
                    for window in [5, 10, 15, 20]:
                        cur.execute("""
                            SELECT close 
                            FROM stock_prices 
                            WHERE symbol = %s AND date > %s 
                            ORDER BY date ASC 
                            OFFSET %s LIMIT 1
                        """, (pick['symbol'], sim_date, window - 1))
                        future = cur.fetchone()
                        if future:
                            exit_price = float(future['close'])
                            ret = (exit_price - performance['entry']) / performance['entry'] * 100
                            performance[f"return_{window}d"] = round(ret, 2)
                        else:
                            performance[f"return_{window}d"] = None
                    
                    results.append(performance)
                    
        conn.close()
        
        if not results:
            print("No signals generated in the backtest period.")
            return
            
        df = pd.DataFrame(results)
        print("\n=== Backtest Summary ===")
        print(f"Total Signals: {len(results)}")
        
        for w in [5, 10, 15, 20]:
            col = f"return_{w}d"
            valid_df = df[df[col].notnull()]
            if not valid_df.empty:
                avg_ret = valid_df[col].mean()
                win_rate = (valid_df[col] > 0).mean() * 100
                print(f"{w}-Day Window: Avg Return: {avg_ret:.2f}%, Win Rate: {win_rate:.1f}% (N={len(valid_df)})")
            else:
                print(f"{w}-Day Window: Insufficient data for measurement.")
                
        # Top 5 best picks
        print("\n=== Top 5 Performer (20d) ===")
        if 'return_20d' in df.columns:
            print(df.sort_values('return_20d', ascending=False).head(5)[['symbol', 'date', 'entry', 'return_20d']])
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    import psycopg2.extras
    backtest_strategy(days_back=120) # 4 months backtest
