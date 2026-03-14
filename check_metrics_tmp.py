import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check_stock_metrics(symbol):
    db_url = os.getenv("SUPABASE_DATABASE_URL")
    try:
        conn = psycopg2.connect(db_url)
        with conn.cursor() as cur:
            # Check latest metrics
            cur.execute("""
                SELECT symbol, date, close, dma_50, dma_100, dma_200
                FROM stock_prices 
                WHERE symbol = %s
                ORDER BY date DESC LIMIT 1
            """, (symbol,))
            latest = cur.fetchone()
            print(f"Latest metrics for {symbol}:")
            print(latest)
            
            if latest:
                symbol, date, close, dma_50, dma_100, dma_200 = latest
                if close > dma_50 and close > dma_100 and close > dma_200:
                    print("PASSED DMA checks")
                else:
                    print("FAILED DMA checks")
                
                # Check trend
                # The MV logic: 
                # 1. Find 365d high
                # 2. Find high date
                # 3. Check cumulative average trend since then
                
            cur.execute("""
                SELECT MAX(close) FROM stock_prices 
                WHERE symbol = %s AND date >= (SELECT MAX(date) FROM stock_prices) - INTERVAL '365 days'
            """, (symbol,))
            high_price = cur.fetchone()[0]
            print(f"52w High Price: {high_price}")
            
            cur.execute("""
                SELECT MAX(date) FROM stock_prices 
                WHERE symbol = %s AND close = %s AND date >= (SELECT MAX(date) FROM stock_prices) - INTERVAL '365 days'
            """, (symbol, high_price))
            high_date = cur.fetchone()[0]
            print(f"52w High Date: {high_date}")
            
            cur.execute("""
                WITH RunningAverages AS (
                    SELECT date, close,
                           AVG(close) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cum_avg
                    FROM stock_prices
                    WHERE symbol = %s AND date >= %s
                )
                SELECT date, close, cum_avg,
                       LAG(cum_avg) OVER (ORDER BY date) as prev_cum_avg
                FROM RunningAverages
                ORDER BY date DESC LIMIT 10
            """, (symbol, high_date))
            trend = cur.fetchall()
            print("Latest 10 days of cumulative average trend:")
            for row in trend:
                date, close, cum_avg, prev_cum_avg = row
                status = "UP" if prev_cum_avg is None or cum_avg > prev_cum_avg else "DOWN"
                print(f"{date}: Close={close}, CumAvg={cum_avg}, Prev={prev_cum_avg} -> {status}")
                
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_stock_metrics("SOLARINDS.NS")
