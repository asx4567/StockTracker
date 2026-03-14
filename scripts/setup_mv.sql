-- Create Materialized View for "Stocks to Invest in Crashing Market"
DROP MATERIALIZED VIEW IF EXISTS mv_crashing_market;
CREATE MATERIALIZED VIEW mv_crashing_market AS
WITH Candidates AS (
    SELECT p.symbol, s.name, p.close as current_price, p.date as latest_sync,
           p.dma_50, p.dma_100, p.dma_200
    FROM stock_prices p
    JOIN stocks s ON p.symbol = s.symbol
    WHERE p.date = (SELECT MAX(date) FROM stock_prices)
      AND s.type = 'EQUITY'
      AND p.close > p.dma_50 
      AND p.close > p.dma_100 
      AND p.close > p.dma_200
),
HighDates AS (
    SELECT c.symbol, c.name, MAX(p2.close) as high_price
    FROM Candidates c
    JOIN stock_prices p2 ON c.symbol = p2.symbol
    WHERE p2.date >= (SELECT MAX(date) FROM stock_prices) - INTERVAL '365 days'
    GROUP BY c.symbol, c.name
),
HighDateDetails AS (
    SELECT h.symbol, h.name, h.high_price, 
           MAX(p3.date) as high_date
    FROM HighDates h
    JOIN stock_prices p3 ON h.symbol = p3.symbol AND h.high_price = p3.close
    WHERE p3.date >= (SELECT MAX(date) FROM stock_prices) - INTERVAL '365 days'
    GROUP BY h.symbol, h.name, h.high_price
),
RunningAverages AS (
    SELECT h.symbol, h.name, p.date, p.close,
           AVG(p.close) OVER (PARTITION BY h.symbol ORDER BY p.date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cum_avg
    FROM HighDateDetails h
    JOIN stock_prices p ON h.symbol = p.symbol
    WHERE p.date >= h.high_date
),
TrendCheck AS (
    SELECT symbol, name, date, cum_avg,
           LAG(cum_avg) OVER (PARTITION BY symbol ORDER BY date) as prev_cum_avg,
           ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY date DESC) as rank_desc
    FROM RunningAverages
),
FinalFilters AS (
    SELECT symbol, name,
           COUNT(*) FILTER (WHERE cum_avg > prev_cum_avg) as increasing_days,
           COUNT(*) as total_days_in_window
    FROM TrendCheck
    WHERE rank_desc <= 10
    GROUP BY symbol, name
    HAVING COUNT(*) FILTER (WHERE cum_avg > prev_cum_avg) = 10
       AND COUNT(*) = 10
)
SELECT f.symbol, f.name, h.high_date, h.high_price, c.current_price, 
       c.dma_50, c.dma_100, c.dma_200,
       (SELECT cum_avg FROM RunningAverages r WHERE r.symbol = f.symbol ORDER BY date DESC LIMIT 1) as latest_cum_avg
FROM FinalFilters f
JOIN HighDateDetails h ON f.symbol = h.symbol
JOIN Candidates c ON f.symbol = c.symbol;

-- Create an index to make refreshing and querying even faster
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_symbol ON mv_crashing_market (symbol);
