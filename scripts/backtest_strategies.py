"""
backtest_strategies.py — Multi-strategy backtest for Indian equity market
Optimized: Loads all data in one query, runs simulation fully in-memory with pandas.

Strategies:
  1. Swing Trade: "Momentum Reversal" (3-10 days)
  2. Short-Term: "Bull Continuation" (2-4 weeks)
  3. Long-Term: "52W Strength" (1-3 months)
"""
import os
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
import pandas as pd
from datetime import timedelta

load_dotenv("d:/Projects/MK Stock/.env")


def get_conn():
    return psycopg2.connect(os.getenv("SUPABASE_DATABASE_URL"))


def load_data(conn, days_back=200):
    """Load all EQUITY stock data for the backtest window in one query."""
    print("Loading data from database...")
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("""
            SELECT p.symbol, p.date, p.open, p.close, p.high, p.low, p.volume,
                   p.dma_20, p.dma_50, p.dma_100, p.dma_200,
                   p.rsi_14, p.macd_line, p.macd_signal, p.macd_hist
            FROM stock_prices p
            JOIN stocks s ON p.symbol = s.symbol
            WHERE s.type = 'EQUITY'
              AND p.date >= (SELECT MAX(date) FROM stock_prices) - INTERVAL '%s days'
            ORDER BY p.symbol, p.date ASC
        """ % days_back)
        rows = cur.fetchall()

    df = pd.DataFrame(rows)
    for col in ['close', 'open', 'high', 'low', 'dma_20', 'dma_50', 'dma_100', 'dma_200',
                'rsi_14', 'macd_line', 'macd_signal', 'macd_hist']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(['symbol', 'date']).reset_index(drop=True)
    print(f"Loaded {len(df):,} rows for {df['symbol'].nunique()} stocks.")
    return df


def compute_52w_high(df):
    """For each (symbol, date) compute the rolling 52-week high."""
    df = df.sort_values(['symbol', 'date'])
    df['high_52w'] = df.groupby('symbol')['close'].transform(
        lambda x: x.rolling(252, min_periods=30).max()
    )
    return df


def check_swing(row):
    return (
        pd.notna(row['rsi_14']) and 30 <= row['rsi_14'] <= 55 and
        pd.notna(row['macd_hist']) and row['macd_hist'] > 0 and
        pd.notna(row['dma_20']) and row['close'] > row['dma_20']
    )


def check_short_term(row):
    return (
        pd.notna(row['rsi_14']) and 50 <= row['rsi_14'] <= 70 and
        pd.notna(row['macd_hist']) and row['macd_hist'] > 0 and
        pd.notna(row['dma_20']) and row['close'] > row['dma_20'] and
        pd.notna(row['dma_50']) and row['close'] > row['dma_50']
    )


def check_long_term(row):
    if not (pd.notna(row['dma_50']) and pd.notna(row['dma_100']) and
            pd.notna(row['dma_200']) and pd.notna(row['dma_20']) and
            pd.notna(row['rsi_14']) and pd.notna(row['high_52w'])):
        return False
    close = row['close']
    return (
        close > row['dma_50'] and close > row['dma_100'] and close > row['dma_200'] and
        close >= 0.70 * row['high_52w'] and
        abs(close - row['dma_20']) / row['dma_20'] <= 0.05 and
        row['rsi_14'] <= 65
    )


def compute_returns(df, signal_dates_by_sym, windows, sl_pct, tp_pct):
    """
    For each signal (symbol, date), compute forward returns with SL/TP.
    Returns a DataFrame of signals with returns.
    """
    records = []
    price_by_sym = {sym: grp.set_index('date')['close'] for sym, grp in df.groupby('symbol')}

    for (sym, entry_date), entry_price in signal_dates_by_sym.items():
        prices = price_by_sym.get(sym)
        if prices is None:
            continue

        sl = entry_price * (1 - sl_pct)
        tp = entry_price * (1 + tp_pct)

        future = prices[prices.index > entry_date].head(max(windows))
        exit_price = None
        exit_day = None

        for i, (fdate, fprice) in enumerate(future.items()):
            if fprice <= sl:
                exit_price = sl
                exit_day = i + 1
                break
            if fprice >= tp:
                exit_price = tp
                exit_day = i + 1
                break

        row = {'symbol': sym, 'date': entry_date.date(), 'entry': round(entry_price, 2)}
        for w in windows:
            if exit_day and exit_day <= w:
                ret = (exit_price - entry_price) / entry_price * 100
                row[f'return_{w}d'] = round(ret, 2)
            elif len(future) >= w:
                fp = float(future.iloc[w - 1])
                row[f'return_{w}d'] = round((fp - entry_price) / entry_price * 100, 2)
            else:
                row[f'return_{w}d'] = None

        records.append(row)

    return pd.DataFrame(records)


def print_strategy_results(label, df, windows):
    print(f"\n{label}")
    print(f"  Total Signals: {len(df)}")
    if df.empty:
        print("  No signals generated.")
        return

    for w in windows:
        col = f'return_{w}d'
        valid = df[df[col].notnull()]
        if valid.empty:
            print(f"  {w}-Day: Insufficient data")
            continue
        avg = valid[col].mean()
        win_rate = (valid[col] > 0).mean() * 100
        best = valid[col].max()
        worst = valid[col].min()
        print(f"  {w}-Day  → Avg: {avg:+.2f}%  Win: {win_rate:.1f}%  Best: {best:+.2f}%  Worst: {worst:+.2f}%  (N={len(valid)})")

    top_col = f'return_{windows[-1]}d'
    if top_col in df.columns:
        top3 = df[df[top_col].notnull()].sort_values(top_col, ascending=False).head(3)
        print(f"  Top 3 picks ({windows[-1]}d):")
        for _, r in top3.iterrows():
            sym = r['symbol'].replace('.NS', '')
            print(f"    {sym} | Entry: ₹{r['entry']} | Return: {r[top_col]:+.2f}%")


def run_backtest(days_back=150, warmup_days=30):
    conn = get_conn()
    try:
        df = load_data(conn, days_back + 60)
        conn.close()

        df = compute_52w_high(df)

        # Use only dates within the actual backtest window (after warmup)
        all_dates = sorted(df['date'].unique())
        backtest_dates = all_dates[warmup_days:]
        backtest_dates = backtest_dates[:days_back]

        print(f"Evaluating {len(backtest_dates)} trading dates across {df['symbol'].nunique()} stocks...")

        sig_swing = {}
        sig_short = {}
        sig_long = {}

        for d in backtest_dates:
            day_data = df[df['date'] == d]
            for _, row in day_data.iterrows():
                key = (row['symbol'], row['date'])
                if check_swing(row):
                    sig_swing[key] = row['close']
                if check_short_term(row):
                    sig_short[key] = row['close']
                if check_long_term(row):
                    sig_long[key] = row['close']

        print(f"\nSignals → Swing: {len(sig_swing)}, Short-Term: {len(sig_short)}, Long-Term: {len(sig_long)}")

        r_swing = compute_returns(df, sig_swing, windows=[5, 10], sl_pct=0.025, tp_pct=0.05)
        r_short = compute_returns(df, sig_short, windows=[10, 20], sl_pct=0.04, tp_pct=0.12)
        r_long  = compute_returns(df, sig_long,  windows=[15, 30], sl_pct=0.07, tp_pct=0.20)

        print("\n" + "="*65)
        print("BACKTEST RESULTS — INDIAN EQUITY STRATEGIES (150 Trading Days)")
        print("="*65)

        print_strategy_results("🔄 Strategy 1: Swing (Momentum Reversal)", r_swing, [5, 10])
        print_strategy_results("📈 Strategy 2: Short-Term (Bull Continuation)", r_short, [10, 20])
        print_strategy_results("🏆 Strategy 3: Long-Term (52W Strength)", r_long, [15, 30])

        print("\n" + "="*65)

    except Exception as e:
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    run_backtest(days_back=150)
