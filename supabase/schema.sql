-- Stocks metadata
CREATE TABLE IF NOT EXISTS stocks (
  symbol TEXT PRIMARY KEY,
  name TEXT,
  type TEXT,
  sector TEXT,
  exchange TEXT
);

-- Daily OHLCV prices
CREATE TABLE IF NOT EXISTS stock_prices (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT REFERENCES stocks(symbol),
  date DATE NOT NULL,
  open NUMERIC,
  high NUMERIC,
  low NUMERIC,
  close NUMERIC,
  volume BIGINT,
  ohlcv_hash TEXT, -- New column for retroactive adjustment detection
  UNIQUE(symbol, date)
);
