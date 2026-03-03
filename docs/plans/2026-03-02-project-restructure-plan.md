# Project Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clean up dead code, extract shared utilities, split large files, restructure agent discord modules, and standardize API patterns across the outlet-media-app codebase.

**Architecture:** Bottom-up approach in 5 layers. Each layer is a separate commit. Layer 1 deletes dead code. Layer 2 extracts shared utilities. Layer 3 splits large files and eliminates the 600-line discord-routines duplication. Layer 4 restructures 13 flat discord-*.ts files into grouped subdirectories. Layer 5 standardizes API error handling and JSON parsing.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind v4, shadcn/ui, Supabase, Discord.js (agent)

---

## Task 1: Delete Dead Agent Files

**Files:**
- Delete: `agent/src/jobs.ts`
- Delete: `agent/src/retry.ts`
- Delete: `agent/dist/discord-delegate.js`
- Delete: `agent/prompts/discord-agent.txt`
- Delete: `agent/session/tm1-storage-state.json`
- Verify: `agent/src/index.ts` (confirm jobs.ts reference is already commented out at line 86-89)

**Step 1: Verify jobs.ts is not imported**

Read `agent/src/index.ts` and confirm lines 86-89 show:
```typescript
// Job poller disabled -- spams TypeError: fetch failed every 5s when
// the Supabase agent_jobs table is unreachable or misconfigured.
// Re-enable once the dashboard job queue is wired up properly.
// startJobPoller();
```
Remove these 4 comment lines since the file is being deleted.

**Step 2: Delete the dead files**

```bash
rm agent/src/jobs.ts
rm agent/src/retry.ts
rm agent/dist/discord-delegate.js
rm agent/prompts/discord-agent.txt
rm agent/session/tm1-storage-state.json
```

**Step 3: Remove playwright from agent/package.json**

In `agent/package.json`, remove the `"playwright": "^1.58.2"` line from dependencies (line 17).

**Step 4: Verify agent builds**

```bash
cd agent && npx tsc --noEmit && cd ..
```
Expected: No errors (deleted files had zero imports).

**Step 5: Commit**

```bash
git add -A agent/src/jobs.ts agent/src/retry.ts agent/dist/discord-delegate.js agent/prompts/discord-agent.txt agent/session/tm1-storage-state.json agent/package.json agent/src/index.ts
git commit -m "chore: delete dead code -- jobs.ts, retry.ts, stale dist, unused prompt and session files, playwright dep"
```

---

## Task 2: Extract Shared Frontend Formatters

**Files:**
- Modify: `src/lib/formatters.tsx` (add fmtObjective, computeMarginalRoas)
- Modify: `src/app/admin/dashboard/page.tsx:135-150` (remove local fmtObjective + computeMarginalRoas)
- Modify: `src/app/admin/campaigns/page.tsx:106-122` (remove local fmtObjective + computeMarginalRoas)
- Modify: `src/app/client/[slug]/campaigns/page.tsx:72-75` (remove local fmtObjective)

**Step 1: Add fmtObjective to formatters.tsx**

Add to `src/lib/formatters.tsx`:
```typescript
export function fmtObjective(raw: string | null): string | null {
  if (!raw) return null;
  return raw
    .replace(/^OUTCOME_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
```

**Step 2: Add computeMarginalRoas to formatters.tsx**

Add to `src/lib/formatters.tsx`. Note: this needs a type for the snapshot points. Define it inline:
```typescript
export function computeMarginalRoas(
  points: Array<{ snapshot_date: string; spend: number | null; roas: number | null }>
): number | null {
  if (points.length < 2) return null;
  const sorted = [...points].sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date));
  const first = sorted[0], last = sorted[sorted.length - 1];
  if (first.spend == null || last.spend == null || first.roas == null || last.roas == null) return null;
  const deltaSpend = (last.spend - first.spend) / 100;
  if (deltaSpend <= 0) return null;
  const revFirst = (first.spend / 100) * first.roas;
  const revLast = (last.spend / 100) * last.roas;
  return (revLast - revFirst) / deltaSpend;
}
```

**Step 3: Update dashboard/page.tsx**

In `src/app/admin/dashboard/page.tsx`:
- Add `fmtObjective, computeMarginalRoas` to the import from `@/lib/formatters`
- Delete the local `fmtObjective` function (lines 135-138)
- Delete the local `computeMarginalRoas` function (lines 140-150)

**Step 4: Update campaigns/page.tsx**

In `src/app/admin/campaigns/page.tsx`:
- Add `fmtObjective, computeMarginalRoas` to the import from `@/lib/formatters`
- Delete the local `fmtObjective` function (lines 106-109)
- Delete the local `computeMarginalRoas` function (lines 111-122)

**Step 5: Update client campaigns/page.tsx**

In `src/app/client/[slug]/campaigns/page.tsx`:
- Add `fmtObjective` to the import from `@/lib/formatters`
- Delete the local `fmtObjective` function (lines 72-75)

**Step 6: Verify build**

```bash
npx next build
```
Expected: Build succeeds with no errors.

**Step 7: Commit**

```bash
git add src/lib/formatters.tsx src/app/admin/dashboard/page.tsx src/app/admin/campaigns/page.tsx src/app/client/\\[slug\\]/campaigns/page.tsx
git commit -m "refactor: extract fmtObjective and computeMarginalRoas to shared formatters"
```

---

## Task 3: Extract Meta API Constants

**Files:**
- Create: `src/lib/meta-constants.ts`
- Modify: `src/app/client/[slug]/data.ts:14,46-62` (remove DateRange, META_PRESETS, RANGE_LABELS)
- Modify: `src/app/client/[slug]/campaign/[campaignId]/data.ts:17-33` (remove META_PRESETS, RANGE_LABELS)

**Step 1: Create meta-constants.ts**

Create `src/lib/meta-constants.ts`:
```typescript
export type DateRange =
  | "today"
  | "yesterday"
  | "last_3d"
  | "last_7d"
  | "last_14d"
  | "last_30d"
  | "this_month"
  | "lifetime";

export const META_PRESETS: Record<DateRange, string> = {
  today: "today",
  yesterday: "yesterday",
  last_3d: "last_3d",
  last_7d: "last_7d",
  last_14d: "last_14d",
  last_30d: "last_30d",
  this_month: "this_month",
  lifetime: "lifetime",
};

export const RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last_3d: "Last 3 Days",
  last_7d: "Last 7 Days",
  last_14d: "Last 14 Days",
  last_30d: "Last 30 Days",
  this_month: "This Month",
  lifetime: "Lifetime",
};
```

NOTE: Read the actual files first to get exact values. The above is approximate.

**Step 2: Update client/[slug]/data.ts**

- Add import: `import { type DateRange, META_PRESETS, RANGE_LABELS } from "@/lib/meta-constants";`
- Remove local `DateRange` type (line 14)
- Remove local `META_PRESETS` (lines 46-53)
- Remove local `RANGE_LABELS` (lines 55-62)

**Step 3: Update campaign/[campaignId]/data.ts**

- Add import: `import { type DateRange, META_PRESETS, RANGE_LABELS } from "@/lib/meta-constants";`
- Remove local `META_PRESETS` (lines 17-24)
- Remove local `RANGE_LABELS` (lines 26-33)
- Check if DateRange type is defined here too and remove if so

**Step 4: Verify build**

```bash
npx next build
```

**Step 5: Commit**

```bash
git add src/lib/meta-constants.ts src/app/client/\\[slug\\]/data.ts src/app/client/\\[slug\\]/campaign/\\[campaignId\\]/data.ts
git commit -m "refactor: extract DateRange, META_PRESETS, RANGE_LABELS to shared meta-constants"
```

---

## Task 4: Consolidate Client Portal Helpers

**Files:**
- Modify: `src/app/client/[slug]/lib.ts` (add TrendPoint type if missing)
- Modify: `src/components/charts/portal-charts.tsx` (update import path)
- Delete: `src/app/client/[slug]/_lib/helpers.ts`
- Delete: `src/app/client/[slug]/_lib/` directory

**Step 1: Check what portal-charts.tsx imports from _lib/helpers.ts**

Read `src/components/charts/portal-charts.tsx` line 12 -- it imports `TrendPoint` type.
Read `src/app/client/[slug]/_lib/helpers.ts` -- find the `TrendPoint` interface definition (lines 23-27).

**Step 2: Add TrendPoint to lib.ts if missing**

Check if `TrendPoint` already exists in `src/app/client/[slug]/lib.ts`. If not, add it:
```typescript
export interface TrendPoint {
  date: string;
  roas: number;
  spend: number;
}
```

**Step 3: Update portal-charts.tsx import**

Change:
```typescript
import type { TrendPoint } from "@/app/client/[slug]/_lib/helpers";
```
To:
```typescript
import type { TrendPoint } from "@/app/client/[slug]/lib";
```

**Step 4: Delete _lib directory**

```bash
rm -rf src/app/client/\\[slug\\]/_lib
```

**Step 5: Verify build**

```bash
npx next build
```

**Step 6: Commit**

```bash
git add src/app/client/\\[slug\\]/lib.ts src/components/charts/portal-charts.tsx
git add -A src/app/client/\\[slug\\]/_lib/
git commit -m "refactor: consolidate _lib/helpers.ts into lib.ts, delete _lib directory"
```

---

## Task 5: Extract Agent Shared Utilities

**Files:**
- Create: `agent/src/utils/date-helpers.ts`
- Create: `agent/src/utils/session-loader.ts`
- Create: `agent/src/utils/prompt-formatters.ts`
- Modify: `agent/src/jobs/cron-sweeps.ts` (replace local functions with imports)
- Modify: `agent/src/discord-routines.ts` (replace local functions with imports)

**Step 1: Create date-helpers.ts**

Create `agent/src/utils/date-helpers.ts`:
```typescript
export function todayCST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

export function yesterdayCST(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

export function tomorrowCST(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}
```

**Step 2: Create session-loader.ts**

Read the exact `loadEvents()` and `loadCampaigns()` from `agent/src/jobs/cron-sweeps.ts:51-91` and extract. Also extract `categorizeEvents()` if it exists.

Create `agent/src/utils/session-loader.ts` with the extracted functions. Use proper `unknown` typing for JSON.parse.

**Step 3: Create prompt-formatters.ts**

Read the exact `campaignsSummary()` and `eventsSummary()` from `agent/src/jobs/cron-sweeps.ts:134-162` and extract.

Create `agent/src/utils/prompt-formatters.ts` with the extracted functions.

**Step 4: Update cron-sweeps.ts**

Replace local definitions with imports:
```typescript
import { todayCST, yesterdayCST, tomorrowCST } from "../utils/date-helpers.js";
import { loadEvents, loadCampaigns } from "../utils/session-loader.js";
import { campaignsSummary, eventsSummary } from "../utils/prompt-formatters.js";
```
Delete the local function definitions (lines 51-162 approximately).

**Step 5: Update discord-routines.ts**

Replace local definitions with imports:
```typescript
import { todayCST, yesterdayCST, tomorrowCST } from "./utils/date-helpers.js";
import { loadEvents, loadCampaigns } from "./utils/session-loader.js";
import { campaignsSummary, eventsSummary } from "./utils/prompt-formatters.js";
```
Delete the local function definitions (lines 68-190 approximately).

**Step 6: Verify agent builds**

```bash
cd agent && npx tsc --noEmit && cd ..
```

**Step 7: Commit**

```bash
git add agent/src/utils/ agent/src/jobs/cron-sweeps.ts agent/src/discord-routines.ts
git commit -m "refactor: extract shared agent utilities -- date helpers, session loaders, prompt formatters"
```

---

## Task 6: Eliminate discord-routines.ts Duplication

**Files:**
- Delete: `agent/src/discord-routines.ts` (622 lines)
- Modify: `agent/src/scheduler.ts:7,156-168` (remove getRoutineRunners import, use only getSweepRunners)
- Verify: `agent/src/discord.ts` does NOT import getRoutineRunners directly

**Step 1: Verify discord-routines overlap is complete**

All 7 routines in discord-routines.ts exist identically in cron-sweeps.ts:
- morning-briefing, show-day-check, show-day-monitor, post-show-recap, weekly-report, creative-fatigue, budget-pacing

cron-sweeps.ts has 3 additional: ticket-velocity, client-pulse, boss-supervision.

**Step 2: Update scheduler.ts**

In `agent/src/scheduler.ts`:
- Remove line 7: `import { getRoutineRunners } from "./discord-routines.js";`
- In `getJobRunners()` function (lines 156-168), remove `...routines,` spread and the `const routines = getRoutineRunners();` line
- Keep `...sweeps` from getSweepRunners which contains all 10 routines

Also remove the fallback in `triggerManualJob()` (lines 59-68) that calls `getRoutineRunners()`.

**Step 3: Delete discord-routines.ts**

```bash
rm agent/src/discord-routines.ts
```

Also delete the compiled output if it exists:
```bash
rm -f agent/dist/discord-routines.js
```

**Step 4: Verify agent builds**

```bash
cd agent && npx tsc --noEmit && cd ..
```

**Step 5: Commit**

```bash
git add -A agent/src/discord-routines.ts agent/src/scheduler.ts agent/dist/discord-routines.js
git commit -m "refactor: eliminate discord-routines.ts -- all routines consolidated in jobs/cron-sweeps.ts"
```

---

## Task 7: Split campaign-charts.tsx

**Files:**
- Create: `src/components/client/charts/` directory
- Create: `src/components/client/charts/age-distribution-chart.tsx` (AgeDistributionChart, lines 67-129)
- Create: `src/components/client/charts/gender-donut-chart.tsx` (GenderDonutChart, lines 139-187)
- Create: `src/components/client/charts/age-gender-heatmap.tsx` (AgeGenderHeatmap, lines 191-255)
- Create: `src/components/client/charts/placement-charts.tsx` (PlacementTreemap + PlacementTable, lines 317-417)
- Create: `src/components/client/charts/time-charts.tsx` (HourlyHeatmap + DailyTrendChart + DayOfWeekChart, lines 434-636)
- Create: `src/components/client/charts/types.ts` (shared types: AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow)
- Create: `src/components/client/charts/index.ts` (barrel re-export)
- Delete: `src/components/client/campaign-charts.tsx`

**Step 1: Read campaign-charts.tsx fully to get exact component boundaries and imports**

Read the file. Note which recharts components and shared imports each component group needs.

**Step 2: Create types.ts with shared type definitions**

Extract all 7 type definitions (AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow) into `src/components/client/charts/types.ts`.

**Step 3: Create individual chart files**

Group by related functionality:
- `age-distribution-chart.tsx`: AgeDistributionChart
- `gender-donut-chart.tsx`: GenderDonutChart
- `age-gender-heatmap.tsx`: AgeGenderHeatmap
- `placement-charts.tsx`: PlacementTreemap + PlacementTable (related placement views)
- `time-charts.tsx`: HourlyHeatmap + DailyTrendChart + DayOfWeekChart (related time views)

Each file imports its types from `./types` and its recharts components.

**Step 4: Create barrel index.ts**

```typescript
export { AgeDistributionChart } from "./age-distribution-chart";
export { GenderDonutChart } from "./gender-donut-chart";
export { AgeGenderHeatmap } from "./age-gender-heatmap";
export { PlacementTreemap, PlacementTable } from "./placement-charts";
export { HourlyHeatmap, DailyTrendChart, DayOfWeekChart } from "./time-charts";
export type { AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow } from "./types";
```

**Step 5: Update consuming files**

Find all files that import from `@/components/client/campaign-charts` and update to import from `@/components/client/charts`.

**Step 6: Delete old file**

```bash
rm src/components/client/campaign-charts.tsx
```

**Step 7: Verify build**

```bash
npx next build
```

**Step 8: Commit**

```bash
git add src/components/client/charts/ src/components/client/campaign-charts.tsx
git add -u  # catch any updated imports in consuming files
git commit -m "refactor: split campaign-charts.tsx (636 lines) into focused chart modules"
```

---

## Task 8: Extract Dashboard Data Layer

**Files:**
- Create: `src/app/admin/dashboard/data.ts`
- Modify: `src/app/admin/dashboard/page.tsx` (remove data fetching, import from data.ts)

**Step 1: Read dashboard/page.tsx fully**

Identify:
- `getData()` function (lines 40-130) -- moves to data.ts
- Inline types `AgentLastRun`, `Alert`, `SnapshotRow`, `DailyRow` (lines 33-36) -- moves to data.ts
- Helper functions `fmt`, `daysUntil`, `getUpcomingShows` (lines 134, 152-168) -- stay in page.tsx or move to data.ts

**Step 2: Create data.ts**

Move `getData()` and its return type to `src/app/admin/dashboard/data.ts`.
Move inline types there too. Export everything the page needs.

**Step 3: Update page.tsx**

Import `getData` and types from `./data`. Remove the extracted code.
`fmtObjective` and `computeMarginalRoas` are already imported from `@/lib/formatters` (Task 2).

**Step 4: Verify build**

```bash
npx next build
```

**Step 5: Commit**

```bash
git add src/app/admin/dashboard/data.ts src/app/admin/dashboard/page.tsx
git commit -m "refactor: extract dashboard data layer to separate data.ts"
```

---

## Task 9: Split Client Portal Types

**Files:**
- Create: `src/app/client/[slug]/types.ts`
- Modify: `src/app/client/[slug]/lib.ts` (move types out, re-export from types.ts)

**Step 1: Create types.ts**

Move these 16 type/interface definitions from `lib.ts` (lines 1-165) to a new `types.ts`:
- TmEvent, DemographicsRow, CampaignCard, HeroStats, EventCard, AudienceProfile, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint, Recommendation, CampaignDetailData, TrendPoint
- Constants: AGE_BRACKETS, DAY_LABELS

**Step 2: Update lib.ts**

Add at the top of lib.ts:
```typescript
export type { CampaignCard, HeroStats, EventCard, AudienceProfile, Insight, ... } from "./types";
export { AGE_BRACKETS, DAY_LABELS } from "./types";
```
This preserves backward compatibility -- existing imports from lib.ts continue to work.

**Step 3: Verify build**

```bash
npx next build
```

**Step 4: Commit**

```bash
git add src/app/client/\\[slug\\]/types.ts src/app/client/\\[slug\\]/lib.ts
git commit -m "refactor: split client portal types into dedicated types.ts"
```

---

## Task 10: Restructure Agent Discord Modules

**Files:**
- Create directories: `agent/src/discord/core/`, `agent/src/discord/commands/`, `agent/src/discord/features/`
- Move 13 discord-*.ts files into subdirectories
- Keep `agent/src/state.ts` at root (used by non-discord files: scheduler.ts, bot.ts, etc.)
- Update ALL import paths

**Step 1: Create directory structure**

```bash
mkdir -p agent/src/discord/core agent/src/discord/commands agent/src/discord/features
```

**Step 2: Move files (git mv to preserve history)**

```bash
# Core
git mv agent/src/discord.ts agent/src/discord/core/entry.ts
git mv agent/src/discord-router.ts agent/src/discord/core/router.ts
git mv agent/src/discord-config.ts agent/src/discord/core/config.ts

# Commands
git mv agent/src/discord-slash.ts agent/src/discord/commands/slash.ts
git mv agent/src/discord-schedule.ts agent/src/discord/commands/schedule.ts
git mv agent/src/discord-dashboard.ts agent/src/discord/commands/dashboard.ts
git mv agent/src/discord-admin.ts agent/src/discord/commands/admin.ts
git mv agent/src/discord-supervisor.ts agent/src/discord/commands/supervisor.ts

# Features
git mv agent/src/discord-buttons.ts agent/src/discord/features/buttons.ts
git mv agent/src/discord-memory.ts agent/src/discord/features/memory.ts
git mv agent/src/discord-skills.ts agent/src/discord/features/skills.ts
git mv agent/src/discord-threads.ts agent/src/discord/features/threads.ts
git mv agent/src/discord-restructure.ts agent/src/discord/features/restructure.ts
```

**Step 3: Update ALL internal import paths**

This is the most critical step. Every cross-file import between discord modules must be updated.

Key import relationships to update (from verification):
- `discord/core/config.ts` imports from `./router.js`
- `discord/commands/slash.ts` imports from `../core/entry.js`, `../core/router.js`, `../commands/supervisor.js`, `../commands/dashboard.js`, `../commands/schedule.js`, `../features/buttons.js`, `../features/threads.js`, `../features/restructure.js`, `../core/config.js`
- `discord/features/buttons.ts` imports from `../commands/dashboard.js`, `../commands/schedule.js`, `../commands/supervisor.js`, `../../scheduler.js`
- `discord/commands/schedule.ts` imports from `../core/entry.js`
- `discord/commands/dashboard.ts` imports from `../features/buttons.js`
- `discord/commands/supervisor.ts` imports from `../../runner.js`, `../../state.js`
- `discord/features/memory.ts` imports from `../core/router.js`, `../../runner.js`, `../core/entry.js`, `../core/config.js`
- `discord/features/skills.ts` imports from `../core/router.js`, `../../runner.js`, `../core/entry.js`
- `discord/features/restructure.ts` imports from `../../state.js`
- `discord/core/entry.ts` imports from `../core/router.js`, `../commands/schedule.js`, `../commands/supervisor.js`, `../commands/dashboard.js`, `../../state.js`

**Step 4: Update external consumers**

Files that import from discord modules:
- `agent/src/index.ts` -- update `startDiscordBot` import to `./discord/core/entry.js`
- `agent/src/scheduler.ts` -- update imports (already only imports getSweepRunners from jobs/)
- `agent/src/events/message-handler.ts` -- update any discord imports
- `agent/src/events/inspect-handler.ts` -- update any discord imports
- `agent/src/agents/delegate.ts` -- update any discord imports

**Step 5: Verify agent builds**

```bash
cd agent && npx tsc --noEmit && cd ..
```

**Step 6: Clean stale dist files**

```bash
rm -f agent/dist/discord-*.js agent/dist/discord.js
```

Rebuild dist:
```bash
cd agent && npx tsc && cd ..
```

**Step 7: Commit**

```bash
git add -A agent/src/discord/ agent/src/discord.ts agent/src/discord-*.ts agent/dist/
git commit -m "refactor: restructure 13 discord modules into core/commands/features subdirectories"
```

---

## Task 11: Create API Error Helpers

**Files:**
- Create: `src/lib/api-helpers.ts`
- Test: `src/lib/api-helpers.test.ts`

**Step 1: Write the test**

Create `src/lib/api-helpers.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { authGuard, apiError, apiSuccess } from "./api-helpers";

describe("authGuard", () => {
  it("returns 401 response when userId is null", async () => {
    const res = authGuard(null);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
    const body = await res!.json();
    expect(body.error).toBe("Unauthenticated");
  });

  it("returns null when userId is present", () => {
    const res = authGuard("user_123");
    expect(res).toBeNull();
  });
});

describe("apiError", () => {
  it("returns JSON error response with given status", async () => {
    const res = apiError("Not found", 404);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Not found");
  });
});

describe("apiSuccess", () => {
  it("returns 200 JSON response by default", async () => {
    const res = apiSuccess({ ok: true });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/api-helpers.test.ts
```
Expected: FAIL (module not found)

**Step 3: Implement api-helpers.ts**

Create `src/lib/api-helpers.ts`:
```typescript
import { NextResponse } from "next/server";

export function authGuard(userId: string | null): NextResponse | null {
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  return null;
}

export function apiError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/api-helpers.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/api-helpers.ts src/lib/api-helpers.test.ts
git commit -m "feat: add shared API error helpers with tests"
```

---

## Task 12: Apply API Helpers to Routes

**Files:**
- Modify: `src/app/api/meta/route.ts`
- Modify: `src/app/api/ticketmaster/route.ts`
- Modify: `src/app/api/agents/route.ts`
- Modify: `src/app/api/agents/job/[id]/route.ts`
- Modify: `src/app/api/agents/jobs/route.ts`
- Modify: `src/app/api/admin/invite/route.ts`
- Modify: `src/app/api/admin/users/[userId]/route.ts`

Note: Do NOT modify `ingest/route.ts` (uses secret-based auth, not Clerk) or `alerts/route.ts` (same) or `health/route.ts` (no auth needed).

**Step 1: Update each route**

For each Clerk-authed route, replace the inline auth check pattern:
```typescript
const { userId } = await auth();
if (!userId) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
```
With:
```typescript
import { authGuard, apiError } from "@/lib/api-helpers";
// ...
const { userId } = await auth();
const guard = authGuard(userId);
if (guard) return guard;
```

**Step 2: Run existing tests**

```bash
npx vitest run
```
Expected: All tests pass.

**Step 3: Verify build**

```bash
npx next build
```

**Step 4: Commit**

```bash
git add src/app/api/
git commit -m "refactor: apply shared API helpers across all Clerk-authed routes"
```

---

## Task 13: Standardize Agent JSON Parsing

**Files:**
- Modify: `agent/src/discord/commands/supervisor.ts:33` (was discord-supervisor.ts)
- Modify: `agent/src/discord/commands/dashboard.ts:48,61` (was discord-dashboard.ts)
- Modify: `agent/src/events/message-handler.ts:150`
- Modify: `agent/src/agents/delegate.ts:64,80`
- Modify: `agent/src/services/approval-service.ts:93`

**Step 1: Update each unsafe JSON.parse call**

Pattern: Change `const x = JSON.parse(raw)` or `const x: Type = JSON.parse(raw)` to:
```typescript
const parsed: unknown = JSON.parse(raw);
// then use type guard or explicit cast with validation
```

For each file, read the surrounding code to understand the validation pattern and add appropriate guards.

**Step 2: Verify agent builds**

```bash
cd agent && npx tsc --noEmit && cd ..
```

**Step 3: Commit**

```bash
git add agent/src/
git commit -m "refactor: standardize JSON.parse to use unknown typing across agent code"
```

---

## Task 14: Final Verification

**Step 1: Full frontend build**

```bash
npx next build
```

**Step 2: Full agent build**

```bash
cd agent && npx tsc --noEmit && cd ..
```

**Step 3: Run all tests**

```bash
npx vitest run
```

**Step 4: Verify no stale imports**

```bash
cd agent && grep -r "discord-routines" src/ || echo "clean"
cd agent && grep -r "from.*jobs\"" src/ | grep -v "cron-sweeps" | grep -v "node_modules" || echo "clean"
```

**Step 5: Final commit if any cleanup needed**

If any issues found, fix and commit.
