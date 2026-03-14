import os
import psycopg2
from dotenv import load_dotenv

load_dotenv("d:/Projects/MK Stock/.env")

def setup_mv():
    db_url = os.getenv("SUPABASE_DATABASE_URL")
    sql_path = "d:/Projects/MK Stock/scripts/setup_mv.sql"
    
    with open(sql_path, "r") as f:
        sql = f.read()
        
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        with conn.cursor() as cur:
            print("Creating Materialized View...")
            cur.execute(sql)
            print("Materialized View created successfully!")
        conn.close()
    except Exception as e:
        print(f"Error setting up MV: {e}")

if __name__ == "__main__":
    setup_mv()
