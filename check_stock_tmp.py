import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check_stock_list(pattern):
    db_url = os.getenv("SUPABASE_DATABASE_URL")
    if not db_url:
        print("Error: SUPABASE_DATABASE_URL not found")
        return
        
    try:
        conn = psycopg2.connect(db_url)
        with conn.cursor() as cur:
            query = "SELECT symbol, name, type FROM stocks WHERE symbol ILIKE %s"
            cur.execute(query, (f"%{pattern}%",))
            results = cur.fetchall()
            
            if results:
                print(f"Found {len(results)} matches for pattern '{pattern}':")
                for r in results:
                    print(r)
            else:
                print(f"No matches found for pattern '{pattern}'")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_stock_list("SOLARINDS")
