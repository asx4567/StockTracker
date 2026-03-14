import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(".env")

def get_latest_price(symbol):
    db_url = os.getenv("SUPABASE_DATABASE_URL")
    conn = psycopg2.connect(db_url)
    try:
        with conn.cursor() as cur:
            # First get the latest date for this symbol
            cur.execute("""
                SELECT p.date, p.close, s.name
                FROM stock_prices p
                JOIN stocks s ON p.symbol = s.symbol
                WHERE p.symbol = %s
                ORDER BY p.date DESC
                LIMIT 1
            """, (symbol,))
            row = cur.fetchone()
            if row:
                print(f"Latest price for {symbol} ({row[2]}):")
                print(f"Date: {row[0]}")
                print(f"Close Price: INR {row[1]:.2f}")
            else:
                print(f"No data found for {symbol}")
    finally:
        conn.close()

if __name__ == "__main__":
    get_latest_price("APOLLOTYRE.NS")
