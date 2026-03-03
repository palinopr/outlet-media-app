# Project Restructure Design

Date: 2026-03-02
Scope: Full codebase cleanup, dead code removal, shared utility extraction, file splitting, directory restructuring, pattern standardization.

## Context

Audit of the outlet-media-app codebase found:
- ~600 lines of duplicated code between `discord-routines.ts` and `jobs/cron-sweeps.ts`
- 6 groups of duplicated functions across frontend and agent code
- 10 files exceeding 300 lines that need splitting
- 5 dead files, 1 dead dependency, stale dist artifacts
- 13 flat `discord-*.ts` files that should be grouped
- 3 inconsistent API error handling patterns

## Approach: Bottom-Up Cleanup (5 Layers)

Each layer builds on the previous. Each layer is an independently testable commit.

---

## Layer 1: Delete Dead Code

### Files to delete
- `agent/src/jobs.ts` -- disabled, comment says "spams TypeError every 5s"
- `agent/src/retry.ts` -- zero imports across codebase
- `agent/dist/discord-delegate.js` -- stale, source file removed (moved to agents/delegate.ts)
- `agent/prompts/discord-agent.txt` -- never referenced in discord-router.ts or any code
- `agent/session/tm1-storage-state.json` -- 75KB Playwright state, no code references it

### Dependencies to remove
- `playwright` from `agent/package.json` -- never imported in any agent source file

### Imports to clean
- Remove any stale import/reference to `jobs.ts` in `agent/src/index.ts`

---

## Layer 2: Extract Shared Utilities

### Frontend: `src/lib/`

**`src/lib/formatters.tsx`** -- add:
- `fmtObjective(raw: string | null): string | null` -- currently duplicated in:
  - `src/app/admin/dashboard/page.tsx`
  - `src/app/admin/campaigns/page.tsx`
  - `src/app/client/[slug]/campaigns/page.tsx`
- `computeMarginalRoas(points: SnapshotRow[]): number | null` -- currently duplicated in:
  - `src/app/admin/dashboard/page.tsx`
  - `src/app/admin/campaigns/page.tsx`

**`src/lib/meta-constants.ts`** -- new file with:
- `META_PRESETS` constant -- currently duplicated in:
  - `src/app/client/[slug]/data.ts`
  - `src/app/client/[slug]/campaign/[campaignId]/data.ts`
- `RANGE_LABELS` constant -- same two files
- `DateRange` type -- same two files

### Client portal consolidation
- Merge `src/app/client/[slug]/_lib/helpers.ts` into `src/app/client/[slug]/lib.ts`
- Update import in `src/components/charts/portal-charts.tsx`
- Delete `src/app/client/[slug]/_lib/` directory

### Agent: `agent/src/utils/`

**`agent/src/utils/date-helpers.ts`** -- new file with:
- `todayCST()`, `yesterdayCST()`, `tomorrowCST()` -- currently in 3 agent files

**`agent/src/utils/session-loader.ts`** -- new file with:
- `loadEvents()`, `loadCampaigns()`, `categorizeEvents()` -- currently in 2 agent files

**`agent/src/utils/prompt-formatters.ts`** -- new file with:
- `campaignsSummary()`, `eventsSummary()` -- currently in 2 agent files

---

## Layer 3: Split Large Files

### Eliminate discord-routines.ts duplication
- Delete `agent/src/discord-routines.ts` (622 lines)
- All 7 routines already exist in `agent/src/jobs/cron-sweeps.ts`
- The 3 unique sweeps (ticket-velocity, client-pulse, boss-supervision) only exist in cron-sweeps
- Rewire: update `agent/src/discord.ts` to remove import of `getRoutineRunners`
- Update `agent/src/scheduler.ts` to only use `getSweepRunners` from cron-sweeps

### Split campaign-charts.tsx (636 lines -> 5 files)
Create `src/components/client/charts/`:
- `age-distribution-chart.tsx`
- `gender-donut-chart.tsx`
- `placement-chart.tsx`
- `ad-performance-chart.tsx`
- `budget-trend-chart.tsx`
- `index.ts` (barrel re-export)

Update imports in consuming files.

### Extract dashboard data layer
- Create `src/app/admin/dashboard/data.ts` with data fetching functions from `page.tsx`
- `page.tsx` imports data functions, focuses on rendering

### Split client types
- Create `src/app/client/[slug]/types.ts` with type definitions from `lib.ts`
- `lib.ts` re-exports types and keeps function implementations

---

## Layer 4: Restructure Agent Discord Modules

Move 13 flat `discord-*.ts` files into grouped directories:

```
agent/src/discord/
  core/
    entry.ts         <- discord.ts (main event dispatcher)
    router.ts        <- discord-router.ts
    config.ts        <- discord-config.ts
  commands/
    slash.ts         <- discord-slash.ts
    schedule.ts      <- discord-schedule.ts
    dashboard.ts     <- discord-dashboard.ts
    admin.ts         <- discord-admin.ts
    supervisor.ts    <- discord-supervisor.ts
  features/
    buttons.ts       <- discord-buttons.ts
    memory.ts        <- discord-memory.ts
    skills.ts        <- discord-skills.ts
    threads.ts       <- discord-threads.ts
    restructure.ts   <- discord-restructure.ts
```

- `state.ts` moves to `discord/core/state.ts` (or stays at `agent/src/state.ts` if used by non-discord code)
- All internal import paths updated
- External consumers (`index.ts`, `scheduler.ts`) import from `discord/core/entry.ts`

---

## Layer 5: Standardize Patterns

### API error handling
Create `src/lib/api-helpers.ts`:
- `authGuard(userId: string | null)` -- returns 401 Response or null
- `apiError(message: string, status: number)` -- returns consistent `{ error: string }` JSON response
- `apiSuccess(data: unknown, status?: number)` -- returns consistent success response

Update all API routes in `src/app/api/` to use these helpers.

### Agent JSON parsing
Standardize all `JSON.parse()` calls to:
```typescript
const parsed: unknown = JSON.parse(raw);
```
Then use type guards before casting. Files to update:
- `agent/src/discord-dashboard.ts` (2 occurrences)
- `agent/src/discord-routines.ts` (2 occurrences) -- deleted in Layer 3
- `agent/src/events/message-handler.ts` (1 occurrence)
- `agent/src/agents/delegate.ts` (2 occurrences)

---

## Decisions

- Keep unused shadcn/ui components (Avatar, DropdownMenu, NavigationMenu, Sidebar) -- design system library
- Keep auto-generated database types as-is -- Supabase CLI manages these
- Bottom-up approach -- each layer is a clean, reviewable commit
- Agent discord modules get subdirectory grouping

## Risk Assessment

- **Layer 1**: Zero risk (deleting confirmed dead code)
- **Layer 2**: Low risk (extracting to shared modules, updating imports)
- **Layer 3**: Medium risk (file splitting, import path changes -- verify build after)
- **Layer 4**: Medium risk (directory restructure -- all imports must be updated)
- **Layer 5**: Low risk (wrapper functions, no behavior change)

Build and test after each layer.
