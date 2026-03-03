# Direct Meta API for Campaigns — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Supabase-backed campaign data on both admin and client pages with direct Meta Graph API calls so all campaigns (active, paused, archived, deleted) are visible in real time.

**Architecture:** New shared `src/lib/meta-campaigns.ts` fetches all campaigns + insights + daily breakdown from the Meta Graph API using env vars `META_ACCESS_TOKEN` and `META_AD_ACCOUNT_ID`. A `guessClientSlug()` utility derives client ownership from campaign names. Admin and client pages both consume this shared module. No Supabase dependency for campaign data.

**Tech Stack:** Next.js 15 server components, Meta Marketing API v21.0, TypeScript strict

---

### Task 1: Create `guessClientSlug` utility

**Files:**
- Create: `src/lib/client-slug.ts`
- Create: `__tests__/lib/client-slug.test.ts`

**Step 1: Write the failing test**

```ts
// __tests__/lib/client-slug.test.ts
import { guessClientSlug } from "@/lib/client-slug";

describe("guessClientSlug", () => {
  it("maps arjona to zamora", () => {
    expect(guessClientSlug("Arjona Sacramento V2")).toBe("zamora");
  });
  it("maps alofoke to zamora", () => {
    expect(guessClientSlug("Alofoke Tour")).toBe("zamora");
  });
  it("maps camila to zamora", () => {
    expect(guessClientSlug("Camila Anaheim")).toBe("zamora");
  });
  it("maps kybba", () => {
    expect(guessClientSlug("KYBBA Miami")).toBe("kybba");
  });
  it("maps beamina", () => {
    expect(guessClientSlug("Beamina Spring")).toBe("beamina");
  });
  it("maps happy paws with space", () => {
    expect(guessClientSlug("Happy Paws Rescue")).toBe("happy_paws");
  });
  it("maps happy_paws with underscore", () => {
    expect(guessClientSlug("happy_paws campaign")).toBe("happy_paws");
  });
  it("returns unknown for unrecognized", () => {
    expect(guessClientSlug("Some Random Campaign")).toBe("unknown");
  });
  it("handles null/empty", () => {
    expect(guessClientSlug("")).toBe("unknown");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/lib/client-slug.test.ts`
Expected: FAIL — module not found

**Step 3: Write implementation**

```ts
// src/lib/client-slug.ts

const CLIENT_RULES: Array<{ keywords: string[]; slug: string }> = [
  { keywords: ["arjona", "alofoke", "camila"], slug: "zamora" },
  { keywords: ["kybba"], slug: "kybba" },
  { keywords: ["beamina"], slug: "beamina" },
  { keywords: ["happy paws", "happy_paws"], slug: "happy_paws" },
];

export function guessClientSlug(campaignName: string): string {
  const lower = campaignName.toLowerCase();
  for (const rule of CLIENT_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.slug;
    }
  }
  return "unknown";
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/lib/client-slug.test.ts`
Expected: PASS — all 9 tests

**Step 5: Commit**

```bash
git add src/lib/client-slug.ts __tests__/lib/client-slug.test.ts
git commit -m "feat: add guessClientSlug utility for deriving client from campaign name"
```

---

### Task 2: Create shared `meta-campaigns.ts` module

**Files:**
- Create: `src/lib/meta-campaigns.ts`

This module fetches all campaigns + insights + daily sparkline data from Meta in 3 parallel API calls.

**Step 1: Write the module**

```ts
// src/lib/meta-campaigns.ts
import { META_API_VERSION, type DateRange, META_PRESETS } from "./constants";
import { guessClientSlug } from "./client-slug";

export interface MetaCampaignCard {
  campaignId: string;
  name: string;
  status: string;
  objective: string;
  clientSlug: string;
  spend: number;        // dollars
  roas: number | null;
  revenue: number | null;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  cpm: number | null;
  dailyBudget: number | null; // dollars
  startTime: string | null;
}

export interface DailyInsight {
  campaignId: string;
  date: string;
  spend: number;
  roas: number | null;
}

export interface MetaCampaignsResult {
  campaigns: MetaCampaignCard[];
  dailyInsights: DailyInsight[];
  clients: string[];
  error: string | null;
}

function getCredentials() {
  const token = process.env.META_ACCESS_TOKEN;
  const rawAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawAccountId) return null;
  const accountId = rawAccountId.replace(/^act_/, "");
  return { token, accountId };
}

interface MetaPagedResponse<T> {
  data: T[];
  paging?: { next?: string };
}

async function fetchAllPages<T>(url: string): Promise<T[]> {
  const all: T[] = [];
  let nextUrl: string | null = url;
  while (nextUrl) {
    const res = await fetch(nextUrl, { next: { revalidate: 300 } });
    if (!res.ok) return all;
    const json: MetaPagedResponse<T> = await res.json();
    if (json.data) all.push(...json.data);
    nextUrl = json.paging?.next ?? null;
  }
  return all;
}

interface RawCampaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  start_time?: string;
}

interface RawInsight {
  campaign_id: string;
  campaign_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  cpm: string;
  purchase_roas?: Array<{ action_type: string; value: string }>;
}

interface RawDailyInsight extends RawInsight {
  date_start: string;
}

export async function fetchAllCampaigns(
  range: DateRange,
): Promise<MetaCampaignsResult> {
  const creds = getCredentials();
  if (!creds) {
    return { campaigns: [], dailyInsights: [], clients: [], error: "Meta API credentials not configured" };
  }

  const { token, accountId } = creds;
  const preset = META_PRESETS[range];

  // Build URLs
  const campaignsUrl = new URL(
    `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/campaigns`,
  );
  campaignsUrl.searchParams.set("access_token", token);
  campaignsUrl.searchParams.set("fields", "id,name,status,objective,daily_budget,start_time");
  campaignsUrl.searchParams.set("limit", "500");

  const insightsUrl = new URL(
    `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/insights`,
  );
  insightsUrl.searchParams.set("access_token", token);
  insightsUrl.searchParams.set("level", "campaign");
  insightsUrl.searchParams.set(
    "fields",
    "campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,purchase_roas",
  );
  insightsUrl.searchParams.set("date_preset", preset);
  insightsUrl.searchParams.set("limit", "500");

  const dailyUrl = new URL(
    `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/insights`,
  );
  dailyUrl.searchParams.set("access_token", token);
  dailyUrl.searchParams.set("level", "campaign");
  dailyUrl.searchParams.set("fields", "campaign_id,spend,purchase_roas");
  dailyUrl.searchParams.set("date_preset", preset);
  dailyUrl.searchParams.set("time_increment", "1");
  dailyUrl.searchParams.set("limit", "5000");

  try {
    const [rawCampaigns, rawInsights, rawDaily] = await Promise.all([
      fetchAllPages<RawCampaign>(campaignsUrl.toString()),
      fetchAllPages<RawInsight>(insightsUrl.toString()),
      fetchAllPages<RawDailyInsight>(dailyUrl.toString()),
    ]);

    // Build insight lookup
    const insightMap = new Map<string, RawInsight>();
    for (const row of rawInsights) {
      insightMap.set(row.campaign_id, row);
    }

    // Build campaigns
    const campaigns: MetaCampaignCard[] = rawCampaigns.map((c) => {
      const insight = insightMap.get(c.id);
      const spend = insight ? parseFloat(insight.spend) || 0 : 0;
      const roasVal = insight?.purchase_roas?.find(
        (r) => r.action_type === "omni_purchase",
      )?.value;
      const roas = roasVal ? parseFloat(roasVal) : null;

      return {
        campaignId: c.id,
        name: c.name,
        status: c.status,
        objective: c.objective ?? "",
        clientSlug: guessClientSlug(c.name),
        spend,
        roas,
        revenue: roas != null ? spend * roas : null,
        impressions: insight ? parseInt(insight.impressions) || 0 : 0,
        clicks: insight ? parseInt(insight.clicks) || 0 : 0,
        ctr: insight ? parseFloat(insight.ctr) || null : null,
        cpc: insight ? parseFloat(insight.cpc) || null : null,
        cpm: insight ? parseFloat(insight.cpm) || null : null,
        dailyBudget: c.daily_budget ? parseInt(c.daily_budget) / 100 : null,
        startTime: c.start_time ?? null,
      };
    });

    // Build daily insights for sparklines
    const dailyInsights: DailyInsight[] = rawDaily.map((d) => {
      const roasVal = d.purchase_roas?.find(
        (r) => r.action_type === "omni_purchase",
      )?.value;
      return {
        campaignId: d.campaign_id,
        date: d.date_start,
        spend: parseFloat(d.spend) || 0,
        roas: roasVal ? parseFloat(roasVal) : null,
      };
    });

    // Derive unique client slugs
    const clients = [...new Set(campaigns.map((c) => c.clientSlug))]
      .filter((s) => s !== "unknown")
      .sort();

    return { campaigns, dailyInsights, clients, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Meta API request failed";
    return { campaigns: [], dailyInsights: [], clients: [], error: msg };
  }
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/lib/meta-campaigns.ts`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/lib/meta-campaigns.ts
git commit -m "feat: add shared meta-campaigns module for direct Meta API fetches"
```

---

### Task 3: Rewrite admin campaigns data layer

**Files:**
- Modify: `src/app/admin/campaigns/data.ts` (full rewrite)

Replace the Supabase-only query with `fetchAllCampaigns()` from the new shared module.

**Step 1: Rewrite data.ts**

```ts
// src/app/admin/campaigns/data.ts
import { fetchAllCampaigns, type MetaCampaignCard, type DailyInsight } from "@/lib/meta-campaigns";
import { type DateRange } from "@/lib/constants";

export type { MetaCampaignCard, DailyInsight, DateRange };

export interface CampaignsData {
  campaigns: MetaCampaignCard[];
  clients: string[];
  dailyInsights: DailyInsight[];
  error: string | null;
}

export async function getCampaigns(
  clientSlug: string | null,
  range: DateRange,
): Promise<CampaignsData> {
  const result = await fetchAllCampaigns(range);

  let campaigns = result.campaigns;
  if (clientSlug) {
    campaigns = campaigns.filter((c) => c.clientSlug === clientSlug);
  }

  return {
    campaigns,
    clients: result.clients,
    dailyInsights: result.dailyInsights,
    error: result.error,
  };
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: Type errors in page.tsx and columns.tsx (expected — they still reference old `MetaCampaign` type). We fix these in Tasks 4-5.

**Step 3: Commit**

```bash
git add src/app/admin/campaigns/data.ts
git commit -m "feat: rewrite admin campaigns data layer to use Meta API directly"
```

---

### Task 4: Update admin campaigns page with date range picker

**Files:**
- Modify: `src/app/admin/campaigns/page.tsx`

Add date range picker (same options as client portal) and update to use new data shape. The page now accepts a `range` search param and passes it to `getCampaigns()`. Summary stats compute from `MetaCampaignCard` (spend in dollars, not cents).

**Step 1: Rewrite page.tsx**

The key changes:
- Import `DateRange` from data.ts, import `DATE_OPTIONS` from client portal lib or define locally
- Parse `range` from searchParams alongside `client`
- Remove `centsToUsd()` calls (spend is already in dollars from Meta)
- Add date range picker UI (same `<select>` approach as client filter)
- Show error state when Meta API fails
- Show "all" as default client, "lifetime" as default range

Refer to `src/app/client/[slug]/page.tsx:39-43` for how the client portal parses range params.

Refer to `src/app/client/[slug]/lib.ts:21-28` for `DATE_OPTIONS`.

Important: the stat cards compute `totalSpend` by summing `c.spend` directly (already dollars). No `centsToUsd()`.

**Step 2: Verify build**

Run: `npx next build` or `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/admin/campaigns/page.tsx
git commit -m "feat: add date range picker to admin campaigns, use Meta API data"
```

---

### Task 5: Update campaign table and columns for new data shape

**Files:**
- Modify: `src/components/admin/campaigns/campaign-table.tsx`
- Modify: `src/components/admin/campaigns/columns.tsx`
- Modify: `src/components/admin/campaigns/campaign-cells.tsx`

The columns must update to:
1. Use `MetaCampaignCard` instead of `MetaCampaign` (Supabase row type)
2. Access `row.original.spend` directly (dollars, not cents — remove `centsToUsd()`)
3. Access `row.original.clientSlug` instead of `row.original.client_slug`
4. Remove `ClientSelect` column (client is auto-derived, not editable)
5. Update `RoasSparkline` to accept `DailyInsight[]` instead of `SnapshotPoint[]`
6. Update `BudgetBar` to accept dollar values directly
7. The `StatusSelect` and `SyncButton` still work (they talk to Meta directly via server actions)
8. Update the marginal ROAS computation to use `DailyInsight[]` (spend in dollars, not cents)

**campaign-table.tsx** changes:
- Props change from `MetaCampaign[]` + `snapshotsByCampaign` to `MetaCampaignCard[]` + `dailyInsightsByCampaign: Record<string, DailyInsight[]>`
- Import types from `@/lib/meta-campaigns` instead of `@/app/admin/campaigns/data`

**columns.tsx** changes:
- Import `MetaCampaignCard` and `DailyInsight` from `@/lib/meta-campaigns`
- `getCampaignColumns` options: replace `snapshotsByCampaign: Record<string, SnapshotPoint[]>` with `dailyInsightsByCampaign: Record<string, DailyInsight[]>`
- Column `client_slug`: change accessor to read `clientSlug`, make it display-only (no `ClientSelect` dropdown, just `slugToLabel(row.original.clientSlug)`)
- Column `budget`: `row.original.spend` is already dollars, `row.original.dailyBudget` is already dollars — no `centsToUsd()` wrappers
- Column `trend`: pass `dailyInsightsByCampaign[row.original.campaignId]` to sparkline
- Column `marginal`: compute from `DailyInsight[]` where spend is dollars (no /100 conversion)

**campaign-cells.tsx** changes:
- `RoasSparkline`: accept `DailyInsight[]` instead of `SnapshotPoint[]`. Map `d.roas` for the sparkline values.
- Remove `SnapshotPoint` re-export

**Step 1: Update all three files**

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/admin/campaigns/campaign-table.tsx src/components/admin/campaigns/columns.tsx src/components/admin/campaigns/campaign-cells.tsx
git commit -m "feat: update campaign table/columns for direct Meta API data shape"
```

---

### Task 6: Update client portal data layer

**Files:**
- Modify: `src/app/client/[slug]/data.ts`

Replace the Supabase-first campaign lookup with `fetchAllCampaigns()`. The client portal currently:
1. Queries `meta_campaigns` in Supabase for campaign IDs matching the client slug
2. Calls Meta API with those IDs for insights
3. Falls back to Supabase data if Meta fails

New flow:
1. Call `fetchAllCampaigns(range)` (shared module)
2. Filter by `clientSlug === slug`
3. No Supabase dependency for campaigns

Keep the TM events and demographics parts unchanged (they still use Supabase).

Key changes:
- Remove `fetchMetaInsights()`, `buildFromMeta()`, `buildFromSupabase()`, `fetchClientCampaigns()` — all replaced by shared module
- `getData()` calls `fetchAllCampaigns(range)`, filters by slug, then fetches TM data from Supabase
- `getCampaignsPageData()` uses same approach
- `getLastSyncedAt()` can be removed or kept (it reads synced_at from Supabase; not needed if everything is live)
- The `CampaignCard` type from `types.ts` stays the same shape — map from `MetaCampaignCard` to `CampaignCard`
- Keep `buildHeroStats()` and `buildEventCards()` unchanged
- `dataSource` is always `"meta_api"` now (or an error)

**Step 1: Rewrite data.ts**

Map `MetaCampaignCard` -> `CampaignCard`:
```ts
function toCampaignCard(c: MetaCampaignCard): CampaignCard {
  return {
    campaignId: c.campaignId,
    name: c.name,
    status: c.status,
    spend: c.spend,
    roas: c.roas,
    revenue: c.revenue,
    impressions: c.impressions,
    clicks: c.clicks,
    ctr: c.ctr,
    cpc: c.cpc,
    cpm: c.cpm,
    dailyBudget: c.dailyBudget,
    startTime: c.startTime,
  };
}
```

**Step 2: Verify the client portal still loads**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/client/[slug]/data.ts
git commit -m "feat: update client portal to use shared Meta API module"
```

---

### Task 7: Add date range filter component to admin campaigns

**Files:**
- Create: `src/components/admin/campaigns/date-range-filter.tsx`

A client component with a `<select>` that navigates to `?range=X&client=Y` when changed. Same pattern as the existing `ClientFilter` component.

**Step 1: Check the existing ClientFilter for the pattern**

Read: `src/components/admin/campaigns/client-filter.tsx`

**Step 2: Create date-range-filter.tsx**

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const DATE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "lifetime", label: "Lifetime" },
];

export function DateRangeFilter({ selected }: { selected: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={selected}
      onChange={(e) => handleChange(e.target.value)}
      className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {DATE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
```

**Step 3: Wire into page.tsx**

Import `DateRangeFilter` in `src/app/admin/campaigns/page.tsx` and add it next to the `ClientFilter`.

**Step 4: Commit**

```bash
git add src/components/admin/campaigns/date-range-filter.tsx src/app/admin/campaigns/page.tsx
git commit -m "feat: add date range filter to admin campaigns page"
```

---

### Task 8: Update pagination to support larger page sizes

**Files:**
- Modify: `src/components/admin/data-table/data-table-pagination.tsx`

Add page size options beyond 50 to handle large campaign counts.

**Step 1: Update the page size options**

Change line 23 from `[10, 20, 50]` to `[10, 20, 50, 100]`.

**Step 2: Commit**

```bash
git add src/components/admin/data-table/data-table-pagination.tsx
git commit -m "feat: add 100-row page size option to data tables"
```

---

### Task 9: Full integration test

**Step 1: Run type checker**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (including new client-slug tests)

**Step 3: Run dev server and verify**

Run: `npx next dev`
- Visit `/admin/campaigns` — should show ALL campaigns from Meta with date range and client filters
- Visit `/client/zamora` — should show Zamora campaigns from Meta
- Verify sparklines render with daily data
- Verify status toggle and sync button still work

**Step 4: Commit any fixes from testing**

---

### Task 10: Clean up unused Supabase references

**Files:**
- Modify: `src/app/admin/campaigns/data.ts` — confirm no Supabase imports remain
- Modify: `src/app/client/[slug]/data.ts` — confirm Supabase imports only remain for TM events/demographics
- Verify: `src/app/admin/actions/campaigns.ts` — server actions still write to Supabase for audit trail; this is fine

Do NOT delete the `meta_campaigns` table or `campaign_snapshots` table — the agent still uses them.

**Step 1: Verify no stale imports**

Run: `npx tsc --noEmit`

**Step 2: Final commit**

```bash
git commit -m "chore: clean up unused Supabase imports from campaign pages"
```
