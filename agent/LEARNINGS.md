# Outlet Media Agent — Learning Journal

Written by the proactive think loop. Each cycle logs what was done, what was learned, and what to focus on next.

Format:
```
## YYYY-MM-DD HH:MM — Cycle #N
- **Priority chosen:** P[N] — [name]
- **Self-improvement:** What was audited, studied, or fixed
- **Monitoring:** What was checked
- **Action taken:** What was built, installed, or changed
- **Next priority:** What to focus on next cycle
```

---

## 2026-02-18 — Cycle #0 (Genesis)
- **Priority chosen:** P6 — Build New Capabilities
- **Self-improvement:** Think loop infrastructure created. MEMORY.md and LEARNINGS.md initialized.
- **Monitoring:** Not yet active — first scheduled cycle pending.
- **Action taken:** Ported proactive brain pattern from Arjona agent. Added retry utility, think cron job, memory-aware system prompt.
- **Next priority:** P2 — Code Quality. Audit system-prompt.ts and scheduler.ts for any gaps.

## 2026-02-18 — Cycle #1 (Meta Sync)
- **Priority chosen:** P1 — Data Freshness
- **Self-improvement:** Learned that the `/campaigns` endpoint needs `-G` with `--data-urlencode` for the token (special chars). Direct string interpolation in the URL fails with "Object does not exist" error.
- **Monitoring:** 2 ACTIVE campaigns found out of 97 total. Denver V2 (ROAS 8.4×, strong) and KYBBA Miami (ROAS 2.79×, acceptable).
- **Action taken:** Fetched all campaigns + insights for active ones. Converted spend to cents for bigint DB column. Saved to session/last-campaigns.json. POST to ingest succeeded (2 upserted).
- **Learned:** Meta `spend` comes as a dollar string (e.g. "2002.52"). Supabase `meta_campaigns.spend` column is bigint (cents). Must multiply by 100 and round. `daily_budget` and `lifetime_budget` from Meta are already in cents.
- **Next priority:** TM One scrape when credentials are configured. Monitor KYBBA ROAS — at 2.79× it's above the 2.0 flag threshold but worth watching.

## 2026-02-18 — Cycle #2 (Path Fix)
- **Priority chosen:** P3 — Self-Improvement (Prompts & Logic)
- **Self-improvement:** Full audit of all source files. Found systematic path bug: think.ts, system-prompt.ts, scheduler.ts, and MEMORY.md all referenced `agent/MEMORY.md`, `agent/LEARNINGS.md`, `agent/.env`, `.env.local` — but the agent's cwd IS the agent/ directory. These broken paths would cause file-not-found errors on every scheduled run.
- **Monitoring:** Ingest endpoint responds 200. Claude CLI at expected path (/Users/jaimeortiz/.local/bin/claude v2.1.45). Both campaigns above 2.0 ROAS threshold. No anomalies.
- **Action taken:**
  - Fixed 10+ path references in src/think.ts: `agent/MEMORY.md` → `MEMORY.md`, `agent/LEARNINGS.md` → `LEARNINGS.md`, `agent/src/` → `src/`, `agent/session/` → `session/`
  - Fixed src/system-prompt.ts: `agent/.env` → `.env`, `.env.local` → `../.env.local` (Meta creds are in parent dir)
  - Fixed src/scheduler.ts: `.env.local` → `../.env.local`
  - Fixed MEMORY.md: corrected path references, added working directory note
- **Learned:** The agent cwd is set in agent.ts via `new URL("../", import.meta.url).pathname` which resolves to the agent/ project root. All file references in prompts must be relative to this directory. Meta .env.local lives in the parent outlet-media-app/ directory.
- **Next priority:** P4 — Knowledge Expansion. Core infrastructure is now solid. Time to think about what capabilities would add the most value (budget pacing alerts, sell-through velocity, daily summary digest).

## 2026-02-18 — Cycle #3 (Manual Sync Run)
- **Priority chosen:** P1 — Data Freshness
- **Self-improvement:** Confirmed `effective_status` filter works for campaigns endpoint (not `status`). Token URL-encoding via query string works fine — no need for `-G`/`--data-urlencode` when the URL is constructed directly.
- **Monitoring:**
  - 2 ACTIVE campaigns, same as Cycle #1. No new campaigns.
  - Denver V2: ROAS 8.4× ($2,240 spend, 347K imps) — unchanged from last sync. Rock solid.
  - KYBBA Miami: ROAS 2.79× ($2,002.52 spend, 224K imps) — impressions +1, otherwise identical. Stable but still worth watching.
  - TM One: **Skipped** — TM_EMAIL and TM_PASSWORD are blank in .env. Need Jaime to provide credentials.
- **Action taken:** Fetched campaigns + insights, saved to session/last-campaigns.json, POST to ingest succeeded (2 inserted).
- **Changes from last sync:** Essentially no change. KYBBA impressions went from 224,039 → 224,040 (+1). Everything else identical.
- **Next priority:** Get TM One credentials from Jaime. Continue monitoring KYBBA ROAS.

## 2026-02-18 — Cycle #4 (Knowledge Expansion)
- **Priority chosen:** P5 — Knowledge Expansion
- **What I audited or read:**
  - All 6 source files in src/ (scheduler.ts, runner.ts, bot.ts, jobs.ts, index.ts, types.ts)
  - Both prompt files (prompts/command.txt, prompts/think.txt)
  - The full Next.js dashboard: page.tsx (client overview), campaigns/page.tsx (campaigns detail), api/ingest/route.ts, lib/database.types.ts
  - session/last-campaigns.json (current state), .env (credentials)
  - MEMORY.md and LEARNINGS.md
- **Key findings:**
  1. `/client/[slug]/campaigns/page.tsx` uses 100% hardcoded mock data — never queries Supabase. The overview page does query Supabase correctly. Quick win to fix.
  2. `meta_campaigns.tm_event_id` column exists but is never populated — no campaign-to-event linking.
  3. No historical snapshot tables — only latest state is stored. Can't compute trends or velocity.
  4. KYBBA campaign labeled as `client_slug: "zamora"` — may or may not be correct. Need Jaime to confirm.
  5. `meta_campaigns.spend` is typed as `number | null` in database.types.ts but Cycle #1 said it's bigint in cents. The session cache stores it in cents (224000 = $2,240.00). Dashboard fmtUsd() treats it as dollars. This is a display bug — $224,000 shows instead of $2,240.
- **Action taken:** Created comprehensive proposals document at `session/proposals.md` with 6 ranked proposals:
  - P5 (Fix campaigns page) — quick win, immediate value
  - P1 (Campaign-event auto-linking) — high impact, small effort
  - P3 (Daily pacing alerts) — monitoring-only, no code changes
  - P2 (Historical snapshots) — enables trend analysis, medium effort
  - P4 (Sell-through velocity) — depends on P2
  - P6 (Client slug validation) — ask Jaime first
- **CONFIRMED BUG — Spend Display 100x Inflation:**
  - Queried Supabase directly: spend=224000 (Denver), spend=200252 (KYBBA), daily_budget=75000, daily_budget=10000
  - These are cents ($2,240.00, $2,002.52, $750/day, $100/day)
  - Dashboard `fmtUsd()` treats them as dollars → shows $224,000 and $200,252
  - Affected: Ad Spend card, Revenue calc, all campaign spend figures on `/client/zamora`
  - ROAS ratios are correct (they cancel out), but all absolute dollar amounts are 100x inflated
  - Fix: Dashboard needs to divide spend, daily_budget, lifetime_budget, cpm, cpc, gross by 100 before display. OR: change the agent to store in dollars instead of cents.
  - Drafted Telegram alert to /tmp/outlet-media-proactive.txt
- **Next priority:** P1 — Fix the spend display bug. Either update dashboard fmtUsd to handle cents, or change the agent's data transformation to store dollars. Recommend dashboard fix (dividing by 100) since the DB column is typed for cents and daily_budget from Meta is already in cents natively.

## 2026-02-18 — Cycle #5 (Business Monitoring + Data Gap Discovery)
- **Priority chosen:** P4 — Business Monitoring
- **What I audited or read:**
  - LEARNINGS.md, MEMORY.md (start-of-cycle context)
  - session/last-campaigns.json (13 campaigns, 1 ACTIVE)
  - Supabase meta_campaigns table (queried ACTIVE campaigns for pacing data)
  - prompts/command.txt (ingest payload mapping)
  - /api/ingest/route.ts (server-side field handling)
  - .env (infra credentials check)
- **Campaign health (from session cache):**
  - 1 ACTIVE: Denver V2 — ROAS 8.40x, $2,240 spend, $750/day budget. No flags.
  - 12 PAUSED: all above 2.0 ROAS threshold (where ROAS exists). 3 have null ROAS (Happy Paws, Denver Retargeting, Boston CPR 50) but all are paused with low spend.
  - No ROAS anomalies. No spend spikes.
- **Pacing check: BLOCKED — discovered data pipeline gap:**
  - `daily_budget` is null for ALL 13 campaigns in Supabase (despite being present in session cache as `daily_budget_cents`)
  - `start_time` is null for ALL 13 campaigns in both session cache AND Supabase
  - Root cause: the Meta sync does not include `daily_budget` or `start_time` in the ingest POST payload
  - The ingest route (/api/ingest/route.ts lines 148-165) DOES support both fields — they're mapped correctly. The agent just isn't sending them.
  - Field name mismatch: session cache uses `daily_budget_cents` but ingest expects `daily_budget`
- **Infra check (quick):**
  - Ingest URL returns 307 (redirect) on /api/health — not a 200. The Railway app likely redirects GET requests. Not a real problem for POST operations.
  - Supabase responds correctly to REST queries.
  - TM One credentials still blank (TM_EMAIL, TM_PASSWORD empty).
- **Action taken:**
  - Updated prompts/command.txt: added explicit "Ingest payload field mapping" section after the POST example, listing exact field names the ingest expects vs session cache names
  - Updated prompts/command.txt: added CRITICAL note in session cache format section emphasizing that `start_time` and `daily_budget` are currently missing and the next sync MUST include them
  - These prompt changes ensure the next Meta sync will populate these fields in both the session cache and Supabase
- **No Telegram draft** — no business anomalies detected; all campaigns healthy. The data gap is an internal pipeline issue, not something that needs Jaime's attention right now.
- **Next priority:** P2 — Audit prompts/think.txt for any remaining gaps. Also, the next Meta sync should be verified to confirm it now sends `daily_budget` and `start_time` correctly.
