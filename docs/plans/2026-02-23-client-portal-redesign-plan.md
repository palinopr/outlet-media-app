# Client Portal Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite `/client/[slug]/page.tsx` as a clean dark-theme client dashboard — city cards per show, blended spend/ROAS hero numbers, audience profile, date filter (7/14 days), no agency mechanics exposed.

**Architecture:** Server component page reads `searchParams.days` (7 or 14, default 7) to filter `campaign_snapshots` by date range. Shows (city cards) come from `tm_events`. Demographics from `tm_event_demographics`. No campaign names, no Meta terminology, no ad details shown anywhere.

**Tech Stack:** Next.js 15 App Router (server components), Supabase JS client, Tailwind CSS, TypeScript strict, shadcn/ui Table.

---

### Task 1: Add date-filtered data fetching

**Files:**
- Modify: `src/app/client/[slug]/page.tsx`

**Step 1: Replace the `getData` function**

The current `getData` pulls all-time spend/ROAS from `meta_campaigns`. Replace it to pull from `campaign_snapshots` filtered by a date window, and aggregate in JS.

New `getData` signature:
```ts
async function getData(slug: string, days: 7 | 14) {
  if (!supabaseAdmin) return { events: [], snapshots: [], demographics: null };

  // Get campaign IDs for this client
  const campaignsRes = await supabaseAdmin
    .from("meta_campaigns")
    .select("campaign_id")
    .eq("client_slug", slug);
  const campaignIds = (campaignsRes.data ?? []).map((c) => c.campaign_id);

  // Date cutoff
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Fetch snapshots in date range
  const snapshotsRes = campaignIds.length > 0
    ? await supabaseAdmin
        .from("campaign_snapshots")
        .select("spend, roas")
        .in("campaign_id", campaignIds)
        .gte("snapshot_date", cutoffStr)
    : { data: [] };

  // Fetch events and demographics in parallel
  const [eventsRes, demosRes] = await Promise.all([
    supabaseAdmin
      .from("tm_events")
      .select("*")
      .eq("client_slug", slug)
      .order("date", { ascending: true })
      .limit(50),
    campaignIds.length > 0
      ? supabaseAdmin
          .from("tm_event_demographics")
          .select("*")
          .in("tm_id", []) // filled below after events load
      : Promise.resolve({ data: [] }),
  ]);

  const events = (eventsRes.data ?? []) as TmEvent[];

  // Re-fetch demographics with actual tm_ids
  let demographics: AudienceProfile | null = null;
  if (events.length > 0) {
    const tmIds = events.map((e) => e.tm_id);
    const d = await supabaseAdmin
      .from("tm_event_demographics")
      .select("*")
      .in("tm_id", tmIds);
    const rows = (d.data ?? []) as DemographicsRow[];
    if (rows.length > 0) demographics = buildAudienceProfile(rows);
  }

  return {
    events,
    snapshots: snapshotsRes.data ?? [],
    demographics,
  };
}
```

**Step 2: Add aggregate helpers at top of file**

```ts
function aggregateSnapshots(snapshots: { spend: number | null; roas: number | null }[]) {
  const valid = snapshots.filter((s) => s.spend != null && s.spend > 0);
  const totalSpendCents = valid.reduce((sum, s) => sum + (s.spend ?? 0), 0);
  const weightedRoas = valid.reduce((sum, s) => sum + (s.roas ?? 0) * (s.spend ?? 0), 0);
  const blendedRoas = totalSpendCents > 0 ? weightedRoas / totalSpendCents : null;
  return { totalSpendCents, blendedRoas };
}
```

**Step 3: Update the page component signature to accept `searchParams`**

```ts
interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ days?: string }>;
}

export default async function ClientDashboard({ params, searchParams }: Props) {
  const { slug } = await params;
  const { days: daysParam } = await searchParams;
  const days = daysParam === "14" ? 14 : 7;
  const { events, snapshots, demographics } = await getData(slug, days);
  const { totalSpendCents, blendedRoas } = aggregateSnapshots(snapshots);
  // ...
}
```

**Step 4: Verify TypeScript compiles**
```bash
cd /Users/jaimeortiz/outlet-media-app && npm run build 2>&1 | tail -20
```
Expected: 0 errors

**Step 5: Commit**
```bash
git add src/app/client/[slug]/page.tsx
git commit -m "feat: date-filtered snapshot aggregation for client portal"
```

---

### Task 2: Rewrite the page JSX — hero numbers + date filter

**Files:**
- Modify: `src/app/client/[slug]/page.tsx`

**Step 1: Replace the entire return JSX**

Remove all existing JSX (hero cards, secondary stats, shows table, campaigns list, footer). Replace with new structure. Start with just the header + date filter + three hero numbers — no city cards yet.

```tsx
return (
  <div style={{ background: "#09090B", minHeight: "100vh", padding: "2rem" }}>
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 style={{ color: "#FAFAFA", fontSize: "1.25rem", fontWeight: 600 }}>
          {clientName} Campaign
        </h1>
        <p style={{ color: "#A1A1AA", fontSize: "0.75rem", marginTop: "0.25rem" }}>{now}</p>
      </div>

      {/* Date filter toggle */}
      <div style={{
        display: "flex",
        gap: "0.25rem",
        background: "#18181B",
        border: "1px solid #27272A",
        borderRadius: "0.5rem",
        padding: "0.25rem",
      }}>
        {([7, 14] as const).map((d) => (
          <a
            key={d}
            href={`?days=${d}`}
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "0.375rem",
              fontSize: "0.75rem",
              fontWeight: 500,
              textDecoration: "none",
              background: days === d ? "#FAFAFA" : "transparent",
              color: days === d ? "#09090B" : "#A1A1AA",
              transition: "all 0.15s",
            }}
          >
            Last {d}d
          </a>
        ))}
      </div>
    </div>

    {/* Hero numbers */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
      {[
        {
          label: "Total Spend",
          value: fmtUsd(totalSpendCents / 100),
          sub: `Last ${days} days`,
        },
        {
          label: "Blended ROAS",
          value: blendedRoas != null ? `${blendedRoas.toFixed(1)}x` : "--",
          sub: "Return on ad spend",
          valueColor: blendedRoas == null ? "#FAFAFA"
            : blendedRoas >= 3 ? "#4ADE80"
            : blendedRoas >= 2 ? "#FCD34D"
            : "#F87171",
        },
        {
          label: "Shows",
          value: String(events.length),
          sub: "On tour",
        },
      ].map(({ label, value, sub, valueColor }) => (
        <div key={label} style={{
          background: "#18181B",
          border: "1px solid #27272A",
          borderRadius: "0.75rem",
          padding: "1.5rem",
        }}>
          <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            {label}
          </p>
          <p style={{ color: valueColor ?? "#FAFAFA", fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>
            {value}
          </p>
          <p style={{ color: "#A1A1AA", fontSize: "0.75rem", marginTop: "0.375rem" }}>{sub}</p>
        </div>
      ))}
    </div>

    {/* City cards placeholder — Task 3 */}
    {/* Audience placeholder — Task 4 */}
  </div>
);
```

**Step 2: Build check**
```bash
npm run build 2>&1 | tail -20
```
Expected: 0 errors

**Step 3: Commit**
```bash
git add src/app/client/[slug]/page.tsx
git commit -m "feat: client portal hero numbers + date filter toggle"
```

---

### Task 3: City cards grid

**Files:**
- Modify: `src/app/client/[slug]/page.tsx`

**Step 1: Replace the city cards placeholder comment with the grid**

```tsx
{/* City cards */}
<div style={{ marginBottom: "2.5rem" }}>
  <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
    Your Shows
  </p>
  {events.length === 0 ? (
    <div style={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "0.75rem", padding: "3rem", textAlign: "center" }}>
      <p style={{ color: "#A1A1AA", fontSize: "0.875rem" }}>No shows synced yet</p>
    </div>
  ) : (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
      {events.map((e) => {
        const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
        const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : null;
        return (
          <div key={e.id} style={{
            background: "#18181B",
            border: "1px solid #27272A",
            borderRadius: "0.75rem",
            padding: "1.25rem",
          }}>
            {/* City */}
            <p style={{ color: "#FAFAFA", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              {e.city ?? e.name}
            </p>
            {/* Date + venue */}
            <p style={{ color: "#A1A1AA", fontSize: "0.75rem", marginBottom: "1rem" }}>
              {fmtDate(e.date)}{e.venue ? ` · ${e.venue}` : ""}
            </p>
            {/* Sell-through bar — only if data exists */}
            {pct != null && cap > 0 && (
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <span style={{ color: "#A1A1AA", fontSize: "0.6875rem" }}>Sell-through</span>
                  <span style={{ color: "#FAFAFA", fontSize: "0.6875rem", fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: "4px", background: "#27272A", borderRadius: "9999px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    borderRadius: "9999px",
                    background: "#818CF8",
                    width: `${pct}%`,
                  }} />
                </div>
              </div>
            )}
            {/* Status badge */}
            {e.status && (
              <div style={{ marginTop: "0.5rem" }}>
                {statusBadge(e.status)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}
</div>
```

**Step 2: Simplify `statusBadge` — remove sell/capacity text, keep just the pill**

The function is fine as-is, just confirm it doesn't leak internal details. It only shows "On Sale", "Presale", "Sold Out", etc. — client-safe.

**Step 3: Build check**
```bash
npm run build 2>&1 | tail -20
```

**Step 4: Commit**
```bash
git add src/app/client/[slug]/page.tsx
git commit -m "feat: city cards grid on client portal"
```

---

### Task 4: Audience profile section

**Files:**
- Modify: `src/app/client/[slug]/page.tsx`

**Step 1: Replace the audience placeholder with the blended demographics**

```tsx
{/* Audience profile */}
{demographics && demographics.totalFans > 0 && (
  <div style={{ marginBottom: "2.5rem" }}>
    <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
      Audience Profile · {demographics.totalFans.toLocaleString()} tracked fans
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>

      {/* Gender */}
      {(demographics.femalePct != null || demographics.malePct != null) && (
        <div style={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "0.75rem", padding: "1.25rem" }}>
          <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Gender</p>
          {[
            { label: "Female", value: demographics.femalePct, color: "#818CF8" },
            { label: "Male", value: demographics.malePct, color: "#22D3EE" },
          ].map(({ label, value, color }) =>
            value != null ? (
              <div key={label} style={{ marginBottom: "0.625rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ color: "#A1A1AA", fontSize: "0.75rem" }}>{label}</span>
                  <span style={{ color: "#FAFAFA", fontSize: "0.75rem", fontWeight: 600 }}>{value.toFixed(0)}%</span>
                </div>
                <div style={{ height: "4px", background: "#27272A", borderRadius: "9999px" }}>
                  <div style={{ height: "100%", borderRadius: "9999px", background: color, width: `${value}%` }} />
                </div>
              </div>
            ) : null
          )}
          {demographics.marriedPct != null && (
            <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", marginTop: "0.5rem" }}>
              {demographics.marriedPct.toFixed(0)}% married
            </p>
          )}
        </div>
      )}

      {/* Age */}
      {demographics.age1824 != null && (
        <div style={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "0.75rem", padding: "1.25rem" }}>
          <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Age</p>
          {[
            { label: "18–24", value: demographics.age1824 },
            { label: "25–34", value: demographics.age2534 },
            { label: "35–44", value: demographics.age3544 },
            { label: "45–54", value: demographics.age4554 },
            { label: "55+",   value: demographics.ageOver54 },
          ].map(({ label, value }) =>
            value != null ? (
              <div key={label} style={{ marginBottom: "0.625rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ color: "#A1A1AA", fontSize: "0.75rem" }}>{label}</span>
                  <span style={{ color: "#FAFAFA", fontSize: "0.75rem", fontWeight: 600 }}>{value.toFixed(0)}%</span>
                </div>
                <div style={{ height: "4px", background: "#27272A", borderRadius: "9999px" }}>
                  <div style={{ height: "100%", borderRadius: "9999px", background: "#4ADE80", width: `${value}%` }} />
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Income */}
      {demographics.income0_30 != null && (
        <div style={{ background: "#18181B", border: "1px solid #27272A", borderRadius: "0.75rem", padding: "1.25rem" }}>
          <p style={{ color: "#A1A1AA", fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Household Income</p>
          {[
            { label: "<$30k",    value: demographics.income0_30 },
            { label: "$30–60k",  value: demographics.income30_60 },
            { label: "$60–90k",  value: demographics.income60_90 },
            { label: "$90–125k", value: demographics.income90_125 },
            { label: "$125k+",   value: demographics.incomeOver125 },
          ].map(({ label, value }) =>
            value != null ? (
              <div key={label} style={{ marginBottom: "0.625rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ color: "#A1A1AA", fontSize: "0.75rem" }}>{label}</span>
                  <span style={{ color: "#FAFAFA", fontSize: "0.75rem", fontWeight: 600 }}>{value.toFixed(0)}%</span>
                </div>
                <div style={{ height: "4px", background: "#27272A", borderRadius: "9999px" }}>
                  <div style={{ height: "100%", borderRadius: "9999px", background: "#FCD34D", width: `${value}%` }} />
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

    </div>
  </div>
)}
```

**Step 2: Build check**
```bash
npm run build 2>&1 | tail -20
```

**Step 3: Commit**
```bash
git add src/app/client/[slug]/page.tsx
git commit -m "feat: audience profile section on client portal"
```

---

### Task 5: Remove campaigns sub-page from sidebar nav

**Files:**
- Modify: `src/app/client/[slug]/layout.tsx`

**Step 1: Remove the Campaigns nav links**

The campaigns sub-page (`/client/[slug]/campaigns`) exposes individual campaign rows with spend/ROAS per campaign. Remove nav links to it. Clients should only see the overview.

In `layout.tsx`, remove:
```tsx
<a href={`/client/${slug}/campaigns`} ...>Campaigns</a>
```
from both the desktop sidebar nav and the mobile header nav.

Also remove the footer "Powered by Outlet Media" text from `page.tsx` if it was added there — the layout's footer already has it.

**Step 2: Build check**
```bash
npm run build 2>&1 | tail -20
```

**Step 3: Commit**
```bash
git add src/app/client/[slug]/layout.tsx
git commit -m "feat: remove campaigns nav link from client portal"
```

---

### Task 6: Footer + final cleanup

**Files:**
- Modify: `src/app/client/[slug]/page.tsx`

**Step 1: Add footer inside the page**

```tsx
{/* Footer */}
<div style={{ borderTop: "1px solid #27272A", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
  <span style={{ color: "#52525B", fontSize: "0.75rem" }}>Powered by Outlet Media</span>
  <span style={{ color: "#52525B", fontSize: "0.75rem" }}>Data updates every 6 hours</span>
</div>
```

**Step 2: Remove unused imports**

After the rewrite, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`, `ArrowRight` from lucide/shadcn are no longer needed. Remove them.

**Step 3: Final build check**
```bash
npm run build 2>&1 | tail -20
```
Expected: 0 TypeScript errors, all routes compile.

**Step 4: Deploy**
```bash
git add src/app/client/[slug]/page.tsx
git commit -m "feat: client portal redesign — city cards, dark high-contrast theme, date filter"
railway up --detach
```

---

## Verification

After deploy, visit:
- `https://outlet-media-app-production.up.railway.app/client/kybba` — should show KYBBA's hero numbers + city cards
- `https://outlet-media-app-production.up.railway.app/client/zamora` — should show Zamora's shows
- Toggle `?days=7` and `?days=14` in the URL — hero spend/ROAS numbers should change, city cards stay the same
- Confirm: no campaign names, no impressions, no CTR, no Meta terminology visible
