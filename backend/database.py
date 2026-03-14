import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("SUPABASE_DATABASE_URL")

def get_db_connection():
    if not DB_URL:
        raise Exception("SUPABASE_DATABASE_URL not found in environment")
    conn = psycopg2.connect(DB_URL, cursor_factory=RealDictCursor)
    return conn
