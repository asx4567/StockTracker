from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from database import get_db_connection
from datetime import date

app = FastAPI(title="MK Stock API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/metadata")
def get_metadata():
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        
        # Get unique types
        cur.execute("SELECT DISTINCT type FROM stocks WHERE type IS NOT NULL")
        types = [row['type'] for row in cur.fetchall()]
        
        # Get unique symbols
        cur.execute("SELECT symbol, name FROM stocks ORDER BY symbol")
        stocks = cur.fetchall()
        for s in stocks:
            s['symbol'] = s['symbol'].replace('.NS', '')
        
        # Get available dates
        cur.execute("SELECT DISTINCT date FROM stock_prices ORDER BY date DESC LIMIT 100")
        dates = [row['date'].strftime('%Y-%m-%d') for row in cur.fetchall()]
        
        # Get the latest date specifically
        latest_date = dates[0] if dates else None
        
        return {
            "types": types,
            "stocks": [{"symbol": s['symbol'], "name": s['name']} for s in stocks],
            "dates": dates,
            "latest_date": latest_date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/stocks")
def get_stocks(
    type: str = Query("Equity"),
    symbol: Optional[str] = Query(None),
    company_name: Optional[str] = Query(None),
    target_date: Optional[str] = Query(None),
    rules: Optional[str] = Query(None) # JSON string of rules
):
    import json
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        
        # If no date provided, get the latest available date
        if not target_date:
            cur.execute("SELECT MAX(date) FROM stock_prices")
            res = cur.fetchone()
            target_date = res['max'] if res else None
        
        if not target_date:
            return []

        query = """
            SELECT 
                s.symbol, s.name, s.type, s.sector,
                p.date, p.open, p.high, p.low, p.close, p.volume,
                p.dma_20, p.dma_50, p.dma_100, p.dma_200,
                p.rsi_14, p.macd_line, p.macd_signal, p.macd_hist
            FROM stocks s
            JOIN stock_prices p ON s.symbol = p.symbol
            WHERE p.date = %s
        """
        params = [target_date]

        if type and type != "All":
            query += " AND s.type = %s"
            params.append(type)
        
        if symbol:
            db_symbol = symbol if symbol.endswith(".NS") else f"{symbol}.NS"
            query += " AND s.symbol = %s"
            params.append(db_symbol)
            
        if company_name:
            query += " AND s.name ILIKE %s"
            params.append(f"%{company_name}%")

        # Advanced Rules Parsing
        if rules:
            try:
                rules_list = json.loads(rules)
                field_map = {
                    "Price": "p.close", "Open": "p.open", "High": "p.high", "Low": "p.low",
                    "Volume": "p.volume", "DMA20": "p.dma_20", "DMA50": "p.dma_50",
                    "DMA100": "p.dma_100", "DMA200": "p.dma_200", "RSI": "p.rsi_14",
                    "MACD": "p.macd_line", "MACDSignal": "p.macd_signal", "MACDHist": "p.macd_hist"
                }
                allowed_ops = {">": ">", "<": "<", ">=": ">=", "<=": "<=", "==": "="}
                
                if rules_list:
                    rule_clauses = []
                    for idx, rule in enumerate(rules_list):
                        left = rule.get('left')
                        op = rule.get('op')
                        right = rule.get('right')
                        joiner = rule.get('joiner', 'AND') # Default to AND

                        if left in field_map and op in allowed_ops:
                            sql_op = allowed_ops[op]
                            sql_left = field_map[left]
                            clause = ""
                            
                            if right in field_map:
                                # Comparing two fields
                                sql_right = field_map[right]
                                clause = f"{sql_left} {sql_op} {sql_right}"
                            else:
                                # Comparing field with value
                                try:
                                    val = float(right)
                                    clause = f"{sql_left} {sql_op} %s"
                                    # We can't easily use params in the middle of joiners without track
                                    # but we can append to params here
                                except (ValueError, TypeError):
                                    continue
                            
                            if clause:
                                if idx == 0:
                                    rule_clauses.append(clause)
                                    if "%s" in clause: params.append(val)
                                else:
                                    # Validate joiner
                                    sql_joiner = "OR" if joiner.upper() == "OR" else "AND"
                                    rule_clauses.append(f"{sql_joiner} {clause}")
                                    if "%s" in clause: params.append(val)

                    if rule_clauses:
                        # Wrap all rules in a parent AND ( ... )
                        query += " AND (" + " ".join(rule_clauses) + ")"
            except Exception as e:
                print(f"Rules parsing error: {e}")

        query += " ORDER BY s.symbol ASC"
        
        cur.execute(query, params)
        results = cur.fetchall()
        
        # Format decimals and dates for JSON
        for row in results:
            row['symbol'] = row['symbol'].replace('.NS', '')
            for key, val in row.items():
                if isinstance(val, date):
                    row[key] = val.strftime('%Y-%m-%d')
                elif hasattr(val, '__float__'): # handles Decimal
                    row[key] = round(float(val), 2) if val is not None else None

        return results
    except Exception as e:
        print(f"Error fetching stocks: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/reports/crashing-market")
def get_report_crashing_market():
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        
        # Simple query using the Materialized View
        query = "SELECT * FROM mv_crashing_market ORDER BY symbol ASC"
        
        cur.execute(query)
        results = cur.fetchall()

        for row in results:
            row['symbol'] = row['symbol'].replace('.NS', '')
            for key, val in row.items():
                if isinstance(val, date):
                    row[key] = val.strftime('%Y-%m-%d')
                elif hasattr(val, '__float__'):
                    row[key] = round(float(val), 2) if val is not None else None
        
        return results
    except Exception as e:
        print(f"Report error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/api/reports/analyze")
def analyze_report_symbol(symbol: str = Query(...)):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        db_symbol = symbol if symbol.endswith(".NS") else f"{symbol}.NS"
        
        # 1. Find 52w high date for this symbol
        cur.execute("SELECT MAX(date) FROM stock_prices")
        latest_date = cur.fetchone()['max']
        if not latest_date: return []

        query = """
        WITH HighDateInfo AS (
            SELECT MAX(close) as h_price
            FROM stock_prices
            WHERE symbol = %s AND date >= %s - INTERVAL '365 days'
        ),
        TargetDate AS (
            SELECT MAX(date) as h_date
            FROM stock_prices, HighDateInfo
            WHERE symbol = %s AND close = HighDateInfo.h_price AND date >= %s - INTERVAL '365 days'
        )
        SELECT date, close,
               AVG(close) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cum_avg
        FROM stock_prices, TargetDate
        WHERE symbol = %s AND date >= TargetDate.h_date
        ORDER BY date DESC;
        """
        
        cur.execute(query, (db_symbol, latest_date, db_symbol, latest_date, db_symbol))
        results = cur.fetchall()

        for row in results:
            row['date'] = row['date'].strftime('%Y-%m-%d')
            row['close'] = round(float(row['close']), 2)
            row['cum_avg'] = round(float(row['cum_avg']), 2)
        
        return results
    except Exception as e:
        print(f"Analyze error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
