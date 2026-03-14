# MK Stock — Agent Rules

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components by default)
- **Database**: Supabase (PostgreSQL) — anon key only, no service_role
- **Data Source**: `yahoo-finance2` (npm) for OHLCV fetching
- **Indicators**: `technicalindicators` (npm)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Auth**: Supabase Auth

---

## 1. Code Architecture

### Modularity
- One component = one responsibility. Split large components into smaller focused ones.
- Keep files under **200 lines**. If a file grows beyond that, extract logic into helpers.
- Group by **feature**, not by type:
  ```
  app/
    (app)/
      dashboard/
      stock/[symbol]/
      screener/
  components/
    charts/        ← StockChart, RSIChart, MACDChart
    ui/            ← Badge, Card, Spinner, Table
    layout/        ← Navbar, Sidebar, Footer
  lib/
    supabase.ts    ← client + server helpers
    indicators.ts  ← indicator calc functions
    utils.ts       ← formatting, hashing helpers
  ```

### Naming Conventions
- **Components**: PascalCase (`StockCard.tsx`)
- **Utilities / hooks**: camelCase (`useWatchlist.ts`, `formatCurrency.ts`)
- **DB columns**: snake_case (`ohlcv_hash`, `dma_20`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CHART_ROWS = 200`)
- **Types/Interfaces**: PascalCase prefixed with `T` for types, no prefix for interfaces

### TypeScript
- Strict mode always on. No `any` — use `unknown` and narrow.
- Define types for all Supabase row shapes in `lib/types.ts`.
- Use `zod` to validate external data (Yahoo Finance responses).

---

## 2. UI / UX Standards

### Design Principles
- **Dark mode first** — the financial dashboard aesthetic is dark by default.
- **Data density without clutter** — show key metrics prominently; hide secondary info behind toggles or tooltips.
- **Consistent spacing** — use Tailwind spacing scale (4, 8, 12, 16, 24, 32px). No arbitrary values.
- **Color system**:
  - Bullish / positive: `emerald-400` / `emerald-500`
  - Bearish / negative: `rose-400` / `rose-500`
  - Neutral: `slate-400`
  - Primary accent: `violet-500`

### Typography
- Use `Inter` from Google Fonts.
- Numbers/prices: monospaced (`font-mono`) for alignment in tables.
- Headings: `font-semibold`, not bold.

### Motion & Feedback
- Subtle transitions on hover (`transition-colors duration-150`).
- Errors: inline dismissible banners, not blocking modals.
- Toast notifications for async actions (watchlist add/remove).

### Skeleton Loading
- **Never show blank screens** — every async page and component must have a skeleton state.
- Use Next.js `loading.tsx` files alongside each `page.tsx` for automatic Suspense:
  ```
  app/(app)/dashboard/
    page.tsx
    loading.tsx   ← skeleton shown while page data loads
  ```
- Build skeletons using Tailwind's `animate-pulse` with `bg-slate-800` blocks:
  ```tsx
  // Example: StockCardSkeleton
  <div className="animate-pulse rounded-xl bg-slate-800 p-4 space-y-3">
    <div className="h-4 w-1/3 rounded bg-slate-700" />   {/* symbol */}
    <div className="h-6 w-1/2 rounded bg-slate-700" />   {/* price */}
    <div className="h-3 w-1/4 rounded bg-slate-700" />   {/* change */}
  </div>
  ```
- **Match skeleton shape to real content** — same layout, padding, and proportions as the real component.
- Skeleton variants required for: `StockCardSkeleton`, `ChartSkeleton`, `TableRowSkeleton`, `StatTileSkeleton`.
- Chart skeleton: a flat `rounded-xl bg-slate-800 animate-pulse` block at the same `height` as the real chart.
- Table skeleton: repeat 8–10 `TableRowSkeleton` rows to simulate a realistic data load.

### Responsiveness
- Mobile-first layouts. Dashboard grid collapses to single column on `sm`.
- Charts: min-height 200px on mobile, 300px on desktop.
- Tables: horizontally scrollable on mobile with sticky first column.

---

## 3. Performance

### Data Fetching
- **Always server-side** for initial page data (Server Components / `async` page functions).
- Never fetch from Supabase in a client component — pass data as props.
- Use Next.js `revalidate` for caching:
  ```ts
  export const revalidate = 3600; // dashboard: 1 hour
  export const revalidate = 86400; // stock detail: 1 day (data only changes after cron)
  ```

### Database Queries
- Always `SELECT` only the columns you need. Never `SELECT *`.
- Always apply `LIMIT` on time-series queries (e.g. `LIMIT 200` for charts).
- Batch multiple lookups into a single query using `IN` or `GROUP BY`.
- Add DB indexes on `(symbol, date)` — already covered by the UNIQUE constraint.

### Cron Job
- Batch all `MAX(date)` lookups into **one** query across all symbols.
- Bulk upsert using a single Supabase `.upsert()` call per table, not row-by-row.
- Gate indicator calculation behind `rowsAffected > 0` — skip if no price changes.
- Errors on individual symbols must NOT abort the loop — collect and report at end.

### Bundle Size
- Dynamic import heavy components (charts):
  ```ts
  const StockChart = dynamic(() => import('@/components/charts/StockChart'), { ssr: false });
  ```
- Avoid importing entire libraries — use named imports.

---

## 4. Security

- **Never expose** `CRON_SECRET` or any server-only env var with `NEXT_PUBLIC_` prefix.
- Cron route must validate `Authorization: Bearer <CRON_SECRET>` on every request.
- Supabase anon key is safe to use client-side — no elevated privileges.
- `stock_prices` and `stocks` tables: no RLS needed (public read/write via cron).
- `watchlist` table: RLS enabled — users may only read/write their own rows.

---

## 5. Error Handling & Logging

### General Rules
- **Never swallow errors silently.** Every `catch` block must log or propagate.
- All async server functions must be wrapped in `try/catch`.
- Errors on individual symbols in the cron loop must **NOT abort the loop** — collect and report at end.

### Structured Result Type
Return errors as values, not thrown exceptions, from all utility and data functions:
```ts
// lib/types.ts
type Result<T> = { data: T; error: null } | { data: null; error: string };

// Usage
async function fetchOHLCV(symbol: string): Promise<Result<OHLCVRow[]>> {
  try {
    const data = await yahooFinance.historical(symbol, { ... });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}
```

### Exception Handling Patterns

**Cron route (symbol loop) — isolate failures per symbol:**
```ts
const errors: { symbol: string; error: string }[] = [];

for (const symbol of symbols) {
  try {
    await processSymbol(symbol);
  } catch (err) {
    errors.push({ symbol, error: (err as Error).message });
    // Never rethrow — loop continues
  }
}
```

**Server Components / Route Handlers — top-level guard:**
```ts
try {
  const { data, error } = await supabase.from('stock_prices').select(...);
  if (error) throw new Error(error.message);
  return data;
} catch (err) {
  console.error('[dashboard] Failed to fetch prices:', (err as Error).message);
  return []; // graceful fallback
}
```

**External API calls — always set a timeout:**
```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // 10s timeout
await yahooFinance.historical(symbol, { signal: controller.signal });
```

### Logging Conventions
Use a consistent `[context]` prefix so logs are scannable:

| Context | Example |
|---|---|
| Cron | `[cron] RELIANCE.NS: No data returned` |
| DB | `[db] upsert stock_prices failed: duplicate key` |
| Auth | `[auth] Unauthorized cron request from IP x.x.x.x` |
| Fetch | `[fetch] BAJFINANCE.NS: timeout after 10s` |

**Log levels:**
```ts
console.info('[cron] Starting run — 268 symbols');       // normal flow
console.warn('[cron] TMPV.NS: empty result, skipping');  // expected edge case
console.error('[cron] SBIN.NS: fetch failed:', err);     // actual error
```

### UI Error Boundaries
- Every route in `(app)/` must have an `error.tsx` sibling for Next.js error boundaries:
  ```
  app/(app)/dashboard/
    page.tsx
    loading.tsx
    error.tsx   ← catches runtime errors, shows user-friendly message
  ```
- `error.tsx` must be a **Client Component** (required by Next.js):
  ```tsx
  'use client';
  export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-slate-400">
        <p>Something went wrong: {error.message}</p>
        <button onClick={reset} className="text-violet-400 hover:underline">Try again</button>
      </div>
    );
  }
  ```
- Cron job response must always include an `errors` array — even if empty:
  ```json
  { "status": "ok", "processed": 268, "skipped": 2, "errors": [] }
  ```

---

## 6. Supabase Usage

- Use the **server client** (with cookie handling) in Server Components and Route Handlers.
- Use the **browser client** (singleton) only in Client Components for auth state.
- Do not instantiate Supabase clients inline — always import from `lib/supabase.ts`.
- Prefer `.upsert()` with explicit `onConflict` over raw SQL where possible.

---

## 7. Git & File Hygiene

- One logical change per commit. Descriptive commit messages: `feat:`, `fix:`, `chore:`.
- Never commit `.env` or `.env.local`. Use `.env.example` for documentation.
- Keep `supabase/schema.sql` and `supabase/seed_stocks.sql` up to date as the source of truth for DB structure and seed data.
