import os
import psycopg2
from dotenv import load_dotenv

# Get the directory where the script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Look for .env in the parent directory of 'scripts'
load_dotenv(os.path.join(BASE_DIR, "..", ".env"))

def setup_mv():
    db_url = os.getenv("SUPABASE_DATABASE_URL")
    sql_path = os.path.join(BASE_DIR, "setup_mv.sql")
    
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
