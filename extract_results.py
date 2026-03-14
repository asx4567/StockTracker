"""Extract full backtest results to a text file."""
import os, sys
os.chdir("d:/Projects/MK Stock")
sys.path.insert(0, "d:/Projects/MK Stock/scripts")
import backtest_strategies as bs

def extract_results(label, df, windows):
    lines = [label, f"  Total Signals: {len(df)}"]
    if df.empty:
        lines.append("  No signals.")
        return lines
    for w in windows:
        col = f"return_{w}d"
        valid = df[df[col].notnull()]
        if valid.empty:
            lines.append(f"  {w}-Day: No data")
            continue
        avg = valid[col].mean()
        win_rate = (valid[col] > 0).mean() * 100
        best = valid[col].max()
        worst = valid[col].min()
        lines.append(f"  {w}-Day: Avg={avg:+.2f}%  Win={win_rate:.1f}%  Best={best:+.2f}%  Worst={worst:+.2f}%  N={len(valid)}")
    top_col = f"return_{windows[-1]}d"
    top5 = df[df[top_col].notnull()].sort_values(top_col, ascending=False).head(5)
    lines.append(f"  Top 5 ({windows[-1]}d):")
    for _, r in top5.iterrows():
        sym = r["symbol"].replace(".NS", "")
        lines.append(f"    {sym}  Entry:Rs{r['entry']}  Ret:{r[top_col]:+.2f}%")
    return lines

conn = bs.get_conn()
df = bs.load_data(conn, 210)
conn.close()
df = bs.compute_52w_high(df)
all_dates = sorted(df["date"].unique())
backtest_dates = all_dates[30:][:150]

sig_sw, sig_st, sig_lt = {}, {}, {}
for d in backtest_dates:
    day = df[df["date"] == d]
    for _, row in day.iterrows():
        key = (row["symbol"], row["date"])
        if bs.check_swing(row): sig_sw[key] = row["close"]
        if bs.check_short_term(row): sig_st[key] = row["close"]
        if bs.check_long_term(row): sig_lt[key] = row["close"]

r_sw = bs.compute_returns(df, sig_sw, [5, 10], 0.025, 0.05)
r_st = bs.compute_returns(df, sig_st, [10, 20], 0.04, 0.12)
r_lt = bs.compute_returns(df, sig_lt, [15, 30], 0.07, 0.20)

output = []
output.append("=" * 60)
output.append("BACKTEST: Indian Equity Strategies (150 Trading Days)")
output.append("=" * 60)
output += extract_results("[SWING] Momentum Reversal", r_sw, [5, 10])
output.append("")
output += extract_results("[SHORT] Bull Continuation", r_st, [10, 20])
output.append("")
output += extract_results("[LONG ] 52W Strength", r_lt, [15, 30])
output.append("=" * 60)

result_text = "\n".join(output)
print(result_text)

with open("d:/Projects/MK Stock/backtest_full.txt", "w", encoding="utf-8") as f:
    f.write(result_text)
print("Saved to backtest_full.txt")
