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

## 2026-02-18 — Cycle #6 (Prompt Audit: think.txt)
- **Priority chosen:** P2 — Self-Improvement (Prompts)
- **What I audited or read:**
  - prompts/think.txt (full read + cross-check against MEMORY.md and command.txt)
  - prompts/command.txt (full read for field name consistency)
  - prompts/chat.txt (full read for API version, credential paths, client slugs)
  - MEMORY.md (full read for cross-reference)
  - session/last-campaigns.json (current state: 1 ACTIVE, 12 PAUSED)
  - .env (confirmed INGEST_URL format ends with /api/ingest)
- **Bugs found and fixed:**
  1. **P6 health check URL bug in think.txt**: `$INGEST_URL/api/health` was wrong because INGEST_URL=`https://...railway.app/api/ingest` — concatenating `/api/health` produced `.../api/ingest/api/health`. Fixed to extract BASE_URL first with `${INGEST_URL%/api/ingest}`, then use `$BASE_URL/api/health`. This would have caused every P6 infra check to test a non-existent endpoint.
  2. **MEMORY.md alerts endpoint inconsistency**: Said `{ secret, message, level, client_slug? }` but actual endpoint (verified Cycle #5) only accepts `{ secret, message, level }`. Removed the stale `client_slug?` reference.
  3. **Missing P4 campaign status change detection**: think.txt P4 checked ROAS/spend/pacing but had no guidance for detecting ACTIVE↔PAUSED transitions between cycles. Added section to compare current session cache against previous cycle notes and flag unexpected reactivations.
- **Cross-check results (no action needed):**
  - API version v21.0 consistent across all files ✓
  - Ad account ID consistent ✓
  - Client slug mappings serve different purposes in chat.txt (user aliases) vs command.txt (campaign name patterns) — intentional, not a bug
  - Credential path fallback order differs slightly between prompts — acceptable, different contexts
  - Supabase URL in MEMORY.md vs .env — fine as reference material
- **Next priority:** P3 — Memory Maintenance. Clean up MEMORY.md (remove any stale items, consolidate learnings from Cycles #0-6). Alternatively P4 if a fresh data sync happens first.

## 2026-02-18 — Cycle #7 (Memory Maintenance)
- **Priority chosen:** P3 — Memory Maintenance
- **What I audited or read:**
  - LEARNINGS.md (full read — Cycles #0-6, 137 lines)
  - MEMORY.md (full read — 104 lines)
  - session/last-campaigns.json (full read — 13 campaigns, scraped_at 2026-02-18T00:00:00Z, file modified 13:34 today)
  - session/proposals.md (full read — 6 proposals with status tracking)
  - src/scheduler.ts (read-only — verified cron schedule timings)
  - Supabase meta_campaigns (queried: daily_budget STILL null for all 13, start_time STILL null for all 13)
  - Supabase campaign_snapshots (queried: STILL empty — zero rows)
- **Inconsistencies found and fixed:**
  1. **"Cycle #7" phantom references:** MEMORY.md and proposals.md referenced "Cycle #7" but LEARNINGS.md only had Cycles #0-6. These were written during an earlier session that updated memory files but didn't log a LEARNINGS entry. Now resolved — this IS Cycle #7.
  2. **Known Data Pipeline Gaps section outdated:** Said "daily_budget is null for ALL campaigns" without distinguishing session cache (has data for 11/13) from Supabase (null for ALL 13). Rewrote with precise per-system status.
  3. **start_time clarification:** Previously lumped with daily_budget as "same status." Clarified that start_time has a DIFFERENT problem — it's not being fetched from Meta API at all (not just a POST mapping issue). This is important for whoever fixes it next.
  4. **Proposals Status — P6 wording:** Changed "PARTIALLY RESOLVED" → "RESOLVED" (KYBBA slug fix is complete, not partial).
  5. **Missing scheduler timing:** Added scheduler cron details to Things To Remember (TM 2h, Meta 6h, Think 30min 8am-10pm, Heartbeat 1min).
  6. **Session cache precision:** Added note in Data Storage Conventions about the session-vs-Supabase gap for daily_budget_cents.
  7. **Proposals.md "partially stale" note:** Cleaned up redundant wording in Things To Remember — now points to Proposals Status section instead.
- **Supabase verification results:**
  - daily_budget: null × 13 in Supabase (session cache has values for 11/13 — Beamina V3 and KYBBA Miami are null)
  - start_time: null × 13 in both Supabase AND session cache (not fetched from Meta API at all)
  - campaign_snapshots: 0 rows (table exists, no insertion logic)
  - spend values in Supabase are in cents and match expected conversions (224000 = $2,240)
- **What I did NOT change:**
  - LEARNINGS.md early cycles (#0-#3): still useful as historical context and contain specific technical lessons. Not worth trimming yet.
  - proposals.md "Cycle #7" references: now consistent since this IS Cycle #7.
  - No stale campaign data to remove — landscape hasn't changed (1 ACTIVE Denver V2, 12 PAUSED).
- **No Telegram draft** — routine memory maintenance, no business anomalies.
- **Next priority:** P4 — Business Monitoring. Session cache is from today, so data is fresh enough. Run pacing check on Denver V2 (the one ACTIVE campaign). Note: pacing will be blocked without start_time, but ROAS check and status change detection should work.
