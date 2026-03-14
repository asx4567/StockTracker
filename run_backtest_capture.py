import os
import sys

os.chdir("d:/Projects/MK Stock")
sys.path.insert(0, "d:/Projects/MK Stock/scripts")

import backtest_strategies as bs

def print_results(label, df, windows):
    print(label)
    print("  Total Signals: " + str(len(df)))
    if df.empty:
        print("  No signals.")
        return
    for w in windows:
        col = "return_" + str(w) + "d"
        valid = df[df[col].notnull()]
        if valid.empty:
            print("  " + str(w) + "-Day: No data")
            continue
        avg = valid[col].mean()
        win_rate = (valid[col] > 0).mean() * 100
        best = valid[col].max()
        worst = valid[col].min()
        print("  " + str(w) + "-Day  Avg:" + format(avg, "+.2f") + "%  Win:" + format(win_rate, ".1f") + "%  Best:" + format(best, "+.2f") + "%  Worst:" + format(worst, "+.2f") + "%  N=" + str(len(valid)))
    top_col = "return_" + str(windows[-1]) + "d"
    top5 = df[df[top_col].notnull()].sort_values(top_col, ascending=False).head(5)
    print("  Top 5 (" + str(windows[-1]) + "d):")
    for _, r in top5.iterrows():
        sym = r["symbol"].replace(".NS", "")
        print("    " + sym + "  Entry:Rs" + str(r["entry"]) + "  Ret:" + format(r[top_col], "+.2f") + "%")

conn = bs.get_conn()
df = bs.load_data(conn, 210)
conn.close()
df = bs.compute_52w_high(df)
all_dates = sorted(df["date"].unique())
backtest_dates = all_dates[30:][:150]
print("Dates: " + str(len(backtest_dates)) + "  Stocks: " + str(df["symbol"].nunique()))

sig_sw, sig_st, sig_lt = {}, {}, {}
for d in backtest_dates:
    day = df[df["date"] == d]
    for _, row in day.iterrows():
        key = (row["symbol"], row["date"])
        if bs.check_swing(row): sig_sw[key] = row["close"]
        if bs.check_short_term(row): sig_st[key] = row["close"]
        if bs.check_long_term(row): sig_lt[key] = row["close"]

print("Signals: Swing=" + str(len(sig_sw)) + "  ShortTerm=" + str(len(sig_st)) + "  LongTerm=" + str(len(sig_lt)))

r_sw = bs.compute_returns(df, sig_sw, [5, 10], 0.025, 0.05)
r_st = bs.compute_returns(df, sig_st, [10, 20], 0.04, 0.12)
r_lt = bs.compute_returns(df, sig_lt, [15, 30], 0.07, 0.20)

print("=" * 60)
print("BACKTEST RESULTS")
print("=" * 60)
print_results("[SWING] Momentum Reversal", r_sw, [5, 10])
print_results("[SHORT] Bull Continuation", r_st, [10, 20])
print_results("[LONG ] 52W Strength", r_lt, [15, 30])
print("=" * 60)
