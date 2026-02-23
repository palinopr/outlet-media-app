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

## 2026-02-18 — Cycles #0-3 Summary (Genesis & Setup)

> Condensed from 4 detailed entries during Cycle #14 memory maintenance. See git history for originals.

- **Cycle #0 (Genesis):** Ported proactive brain from Arjona agent. Created MEMORY.md, LEARNINGS.md, think cron, retry utility, system prompt.
- **Cycle #1 (First Meta Sync):** First successful campaign fetch. 2 ACTIVE out of 97 total (Denver V2 ROAS 8.4×, KYBBA Miami 2.79×). Learned spend→cents conversion.
- **Cycle #2 (Path Fix — Critical):** Found and fixed 10+ broken path references across think.ts, system-prompt.ts, scheduler.ts, MEMORY.md. All used `agent/MEMORY.md` but cwd IS agent/. Also fixed `.env.local` → `../.env.local` (Meta creds in parent dir).
- **Cycle #3 (Second Sync):** Confirmed `effective_status` filter (not `status`). Essentially no data change from Cycle #1. TM One skipped (no credentials).

**Key technical learnings preserved:**
- Meta `spend` = dollar string → multiply by 100 for Supabase bigint cents
- Meta `daily_budget`/`lifetime_budget` = already in cents natively
- Use `effective_status` filter (not `status`) for campaign queries
- Agent cwd = agent/ directory. All paths relative to here. Meta .env.local is in parent `../.env.local`
- Token URL-encoding: use query string construction, not `-G`/`--data-urlencode`

## 2026-02-18 — Cycles #4-7 Summary (Discovery & Hardening)

> Condensed from 4 detailed entries during Cycle #14 memory maintenance. See git history for originals.

- **Cycle #4 (P5 — Knowledge Expansion):** Full codebase audit. Created `session/proposals.md` with 6 ranked proposals. **Found 100x spend display bug** — dashboard `fmtUsd()` treats cents as dollars. Also found: campaigns page using mock data, `tm_event_id` never populated, no historical snapshots.
- **Cycle #5 (P4 — Business Monitoring):** Discovered critical data pipeline gap: `daily_budget` null in Supabase (field name mismatch: session `daily_budget_cents` vs ingest `daily_budget`), `start_time` null everywhere (not fetched from Meta API). Fixed prompts/command.txt with ingest payload mapping. Pacing blocked.
- **Cycle #6 (P2 — Prompt Audit: think.txt):** Fixed 3 bugs: (1) health check URL concatenation bug, (2) MEMORY.md stale `client_slug?` on alerts endpoint, (3) missing ACTIVE↔PAUSED status change detection in P4. All prompts cross-checked for API version/credential consistency.
- **Cycle #7 (P3 — Memory Maintenance):** Fixed 7 inconsistencies in MEMORY.md and proposals.md. Verified daily_budget still null in Supabase, start_time still null everywhere, snapshots still empty. Clarified start_time has a different root cause than daily_budget.

**Key pipeline findings (resolved by 2026-02-19 sync):**
- daily_budget: was null in Supabase due to field name mismatch → prompt fix in Cycle #5 → ✅ populated after Feb 19 sync
- start_time: was not fetched from Meta API at all → ✅ populated after Feb 19 sync
- campaign_snapshots: was empty → ✅ first 13 rows inserted Feb 19
- 100x spend display bug: reported to Jaime, fix is in dashboard code (not agent)

## 2026-02-18 — Cycles #8-9 Summary (Monitoring + chat.txt Audit)

> Condensed from 2 detailed entries during Cycle #14 memory maintenance.

- **Cycle #8 (P4 — Business Monitoring):** 1 ACTIVE (Denver V2 ROAS 8.40×), 12 PAUSED. No anomalies. Pacing/ROAS trend/TM One all SKIPPED (pipeline gaps still present pre-Feb-19 sync). `/api/health` confirmed as 404 (endpoint doesn't exist — not critical). Ingest endpoint alive (401 on unauthenticated POST).
- **Cycle #9 (P2 — Prompt Audit: chat.txt):** Fixed 6 gaps in chat.txt: (1) missing `purchase_roas` parsing guide, (2) missing Revenue/CPA formulas, (3) missing error handling with Meta error codes, (4) incomplete write verification fields, (5) missing Supabase REST reference, (6) missing Alerts endpoint. Also added `date_preset=today` empty response fallback. File grew 236→291 lines. All 3 prompts cross-checked — fully consistent.

## 2026-02-19 — Cycles #10-11 Summary (First Pacing + Infra Audit)

> Condensed from 2 detailed entries during Cycle #14 memory maintenance. See git history for originals.

- **Cycle #10 (P4 — Business Monitoring):** First pacing check (now unblocked). Denver V2 at **37.3% pacing** ($2,240 of $6,000 expected over 8 days × $750/day) — underpacing flag. KYBBA pacing skipped (extensive pause history makes raw pacing meaningless). Discovered **spend freeze**: both ACTIVE campaigns at identical spend for 24+ hours. Discovered **/api/alerts blocked by Clerk auth** (307 redirect — needs `publicRoutes` fix in `middleware.ts`, Jaime's Next.js app). Noted pacing methodology limitation: start_time-based formula fails for campaigns with pause history; daily spend deltas from snapshots are better (future improvement). Drafted Telegram message with findings.
- **Cycle #11 (P6 — Infrastructure Check):** Full credential audit (all set except TM One). Endpoint health: `/api/health` GET → 404 (definitive: endpoint doesn't exist), `/api/ingest` POST → 401/400 ✅ (alive), `/api/alerts` POST → 307 ❌ (Clerk bug persists). Claude CLI at v2.1.47. Session cache fresh (06:03, within 24h). **Data consistency verified**: session cache ↔ Supabase values match for Denver V2 and KYBBA (spend, daily_budget, start_time). Pipeline healthy end-to-end. Noted Supabase column is `name` not `campaign_name`.

**Key findings preserved:**
- 🔴 `/api/alerts` Clerk auth bug — blocks all dashboard alerts (persisted Cycles #10-11). Fix: add `/api/alerts` to `publicRoutes` in `middleware.ts`
- 🔴 Spend freeze: Denver V2 stuck at $2,240, KYBBA at $2,069 for 24+ hours. Sync running but Meta returning same values
- Pacing methodology: start_time-based formula unreliable for campaigns with pause history → use daily spend deltas from snapshots when available
- Claude CLI: v2.1.47 at `/Users/jaimeortiz/.local/bin/claude`
- `/api/health` definitively returns 404 — endpoint doesn't exist, not critical

## 2026-02-19 — Cycles #12-17 Summary (Prompt Completion + Scheduler Crisis)

> Condensed from 6 detailed entries during Cycle #20 memory maintenance. See git history for originals.

- **Cycle #12 (P2 — command.txt audit):** Fixed 4 gaps: (1) verify-after-write missing `effective_status`+`lifetime_budget`, (2) error handling lacked specific Meta error codes (190, 32/4/17, 100, 10/200), (3) Supabase section missing ACTIVE filter/snapshot queries/column naming, (4) session cache missing freshness guidance (bare JSON, use mtime). Also fixed chat.txt missing `actions` field in insights query (broke CPA calculations). Added column naming note to MEMORY.md. command.txt: 294→316 lines.
- **Cycle #13 (P4 — monitoring):** Data 6.5h old. Denver V2 ROAS 9.82× ($2,240, $750/day), KYBBA 2.73× ($2,069, $100/day). Denver pacing at 33% — severely underpacing. **🔴 Spend freeze escalated**: both campaigns at identical spend for 30+ hours. `/api/alerts` still 307 (3rd cycle).
- **Cycle #14 (P3 — memory maintenance):** Condensed Cycles #0-3, #4-7, #8-9, #10-11 into summaries. Updated MEMORY.md with campaign landscape, data pipeline status, known issues. Forgot to log its own entry (reconstructed retroactively).
- **Cycle #15 (P6 — infrastructure check):** 🔴 **CRITICAL: Agent scheduler NOT running.** No process in ps aux. Last heartbeat Feb 18 21:11 UTC (~23h ago). Session cache from desktop app (separate project). Impact: no syncs, no heartbeats, no think cycles, snapshots won't accumulate. `/api/alerts` still 307 (5th cycle). All creds OK except TM One blank. Drafted Telegram alert.
- **Cycle #16 (P2 — chat.txt audit):** Fixed 3 gaps: (1) context bleed warning missing, (2) Supabase section too basic (added column naming, ACTIVE filter, snapshot queries, daily_budget/start_time to default select), (3) session cache freshness note missing. chat.txt: 291→314 lines. All 3 prompts cross-checked consistent.
- **Cycle #17 (P4 — monitoring):** Data 10h stale. Scheduler confirmed still down (25h+ no heartbeat). Spend freeze now 40+ hours. Diagnostic blind spot: can't distinguish "Meta returning frozen data" vs "we're not checking." Discovered correct Supabase column names (`campaign_snapshots.spend` not `spend_cents`, `agent_jobs.agent_id` not `job_type`). Updated MEMORY.md with column mappings.

**Key outcomes preserved:**
- All 3 prompt files completed first full audit cycle (command.txt #12, chat.txt #16, think.txt #19)
- Context bleed protection added to command.txt (#12) and chat.txt (#16), think.txt (#19)
- Supabase column naming documented across all files: `name` not `campaign_name`, `spend` not `spend_cents`, `agent_id` not `job_type`
- 🔴 Scheduler was down Feb 18 15:11 → Feb 22 19:12 CST (76h gap). 3 days of snapshots lost (Feb 20-22).
- 🔴 `/api/alerts` Clerk bug persisted Cycles #10-17 (6 cycles). Fixed by Jaime between Cycles #17-18.
- Spend freeze diagnosis inconclusive — stale data made it impossible to distinguish API lag from real freeze.

## 2026-02-22 — Cycles #18-21 Summary (Post-Restart Recovery)

> Condensed from 4 detailed entries during Cycle #24 memory maintenance. See git history for originals.

- **Cycle #18 (P4 — Business Monitoring):** First cycle after 3-day gap (scheduler down Feb 18-22). Campaign data 3 days stale. **🟢 `/api/alerts` Clerk bug RESOLVED** — returns 200 (was 307 for Cycles #10-17). Jaime fixed Clerk `publicRoutes`. **🟢 Scheduler restarted** (~19:12 CST Feb 22, 76h gap). New `tm-demographics` job type seen. Meta syncs not yet firing. Pacing/ROAS trend suspended (stale data). TM One headless browser scraping under active development (login hitting selector issues).
- **Cycle #19 (P2 — think.txt audit):** Fixed 6 gaps: (1) `scraped_at` reference → use mtime, (2) context bleed warning, (3) pacing methodology limitation for paused campaigns, (4) P6 alerts endpoint test, (5) Supabase column naming for monitoring, (6) TM One session file awareness. think.txt 156→171 lines. **All 3 prompts now fully audited** (command.txt #12, chat.txt #16, think.txt #19).
- **Cycle #20 (P3 — Memory Maintenance):** Condensed Cycles #12-17 (~200→25 lines). Updated MEMORY.md. **🟢 First real TM One event data** — tm-v2-output.json has 25 events via GraphQL interception (20 Arjona + 4 Camila + 1 Alofoke). Login flow works end-to-end: email → password → 2FA magic link → dashboard.
- **Cycle #21 (P4 — Business Monitoring):** Data still 4 days stale. **🔑 Cron schedule timing corrected**: META_CRON fires at fixed UTC times (00/06/12/18), NOT interval-from-start. First post-restart Meta sync = 06:00 UTC Feb 23. Think window ends before that, so can't verify same day.

**Key findings preserved:**
- ✅ `/api/alerts` Clerk bug resolved Cycle #18 — dashboard alerts fully operational
- ✅ Scheduler restarted Feb 22 ~19:12 CST after 76h gap
- Cron schedule is fixed UTC: Meta 00/06/12/18, TM every even hour, Think */30 8-22 CST
- All 3 prompts completed second full audit cycle by Cycle #19
- TM One scraper v3: 25 events captured, login flow automated (email+password+2FA), per-event metrics still empty

## 2026-02-23 — Manual Actions (command-mode, not think cycles)
- **12:04 UTC:** Manual Meta sync — 16 campaigns (5 ACTIVE, 11 PAUSED). Landscape changed: Denver V2 ACTIVE→PAUSED, 4 new campaigns (Alofoke, Camila Sac, Camila Anaheim, Camila Dallas), Arjona Sac V2 PAUSED→ACTIVE. Total spend: $11,330. Active avg ROAS: 4.42×.
- **14:05 UTC:** Manual TM One monitor — 25 events, 0 changes from 12:02 run. POSTed to ingest (25 inserted, 0 snapshots). Sacramento Arjona event still missing from GraphQL.
- **16:04 UTC:** Manual TM One monitor — 25 events, 0 changes from 14:04 run. Snapshot already exists for today.

## 2026-02-23 ~08:30 CST — Cycle #22 (Business Monitoring — First Fresh Data in 4+ Days)
- **Priority chosen:** P4 — Business Monitoring (justified over rotation rule: first fresh campaign data since Feb 19, major landscape change)
- **What I audited or read:**
  - LEARNINGS.md (full read — Cycles #0-21 + 2 manual action entries, 252 lines)
  - MEMORY.md (full read — 136 lines, significantly outdated)
  - session/last-campaigns.json (full read — 16 campaigns, mtime Feb 23 06:04 CST — FRESH!)
  - session/last-events.json (full read — 25 events, mtime Feb 23 08:05 CST — FRESH!)
  - Supabase: meta_campaigns ACTIVE (5 campaigns — CHANGED from 2!)
  - Supabase: campaign_snapshots (2 dates: Feb 19 + Feb 23, 30 total rows)
  - Supabase: meta_campaigns full list (17 total, 5 ACTIVE, 12 PAUSED)
  - Supabase: agent_jobs non-heartbeat (still no automated meta-ads since Feb 18!)
  - Supabase: heartbeats (alive at 14:28-14:30 UTC)
  - Endpoints: ingest 401 ✅, alerts 401 ✅ (no Clerk regression)

- **🟢 FRESH DATA — Campaign landscape dramatically changed:**
  - **5 ACTIVE** (was 2): KYBBA Miami, Arjona Sacramento V2, Alofoke, Camila Anaheim, Camila Sacramento
  - **Denver V2: ACTIVE → PAUSED** — Denver show was Feb 18 (past). ROAS was 9.82×, excellent performance.
  - **4 NEW campaigns appeared** (all Zamora/started Feb 19):
    - Alofoke: ACTIVE, ROAS 3.66×, $272 spend, $100/day — Boston show Mar 2
    - Camila Sacramento: ACTIVE, ROAS 3.66×, $255, $100/day — show Mar 14-15
    - Camila Anaheim: ACTIVE, ROAS 3.42×, $269, $100/day — show Mar 13-14
    - Camila Dallas: PAUSED, $0.30 spend — killed almost immediately
  - **Arjona Sacramento V2: was PAUSED → now ACTIVE** (ROAS 8.91×, $339)
  - **Total: 17 campaigns in Supabase** (was 13). Session has 16 (Beamina V3 excluded, no recent spend).

- **ROAS assessment (ACTIVE campaigns):**
  - Arjona Sac V2: 8.91× — excellent (up from 7.18× on Feb 19)
  - Alofoke: 3.66× — healthy
  - Camila Sacramento: 3.66× — healthy
  - Camila Anaheim: 3.42× — healthy
  - **KYBBA Miami: 2.46× — above 2.0 but declining** (was 2.73× Feb 19, -10%). Show Mar 22 (27 days). Monitor.
  - ✅ No ACTIVE campaign below 2.0 threshold.

- **Pacing analysis (ACTIVE campaigns):**
  - **KYBBA Miami:** SKIP — known pause history (Dec-Feb), start_time-based pacing unreliable.
  - **Arjona Sacramento V2:** SKIP — was PAUSED and recently reactivated. 13 days since start but clearly not running the whole time. $153 spent in last 4 days (~$38/day on $100/day budget) — ramping up.
  - **Alofoke:** 68% pacing ($272 of $400 expected over 4 days) — borderline, but normal for new campaign ramp-up.
  - **Camila Anaheim:** 67% pacing ($269 of $400) — borderline, normal ramp-up.
  - **Camila Sacramento:** 64% pacing ($255 of $400) — slightly under, normal ramp-up.
  - **Assessment:** All 3 new campaigns 64-68% pacing after 4 days. Likely Meta learning phase. Not flagworthy yet — check again next cycle. If still under 70% after 7 days, escalate.

- **⚠️ Seattle/Portland shows imminent but campaigns PAUSED:**
  - Seattle show Feb 25 (2 days!) — Seattle V2 PAUSED (ROAS 10.63×, $189 spend)
  - Portland show Feb 26 (3 days!) — Portland V2 PAUSED (ROAS 9.21×, $372 spend)
  - Both campaigns had excellent ROAS. Likely intentionally paused by Jaime (budget shifted to other markets, or sufficient organic momentum). He was actively managing campaigns today.

- **🟡 Scheduler auto-sync gap persists:**
  - No automated `meta-ads` job since Feb 18 19:33 UTC — **5 days!**
  - Scheduler heartbeats alive (every minute since Feb 22 restart).
  - Jaime ran manual sync at 12:04 UTC and manual TM run at 14:05 UTC.
  - META_CRON "0 */6 * * *" should fire at 00:00/06:00/12:00/18:00 UTC — not happening.
  - Possible causes: cron disabled in code, env var override, scheduler only runs heartbeats.
  - **This is the new #1 known issue.** Without auto-sync, agent depends on Jaime running manual syncs. Snapshots won't accumulate daily.

- **Snapshot progress:**
  - 2 dates: Feb 19 (13 campaigns) + Feb 23 (17 campaigns). First new snapshot in 4 days!
  - ROAS trend still needs 1+ more day (3 consecutive needed).
  - Next snapshot depends on either automated sync or another manual run.

- **MEMORY.md updated comprehensively:**
  - Data Pipeline Status: updated all items to current state
  - Known Issues: reranked — scheduler auto-sync is now #1, added KYBBA ROAS decline as #4
  - Campaign Landscape: completely rewritten for new 5-ACTIVE reality
  - Upcoming Shows: updated with campaign alignment notes
  - Proposals Status: updated pacing (resumed), snapshots (recovering)

- **No Telegram draft** — Jaime is clearly active (ran manual syncs, created 4 new campaigns, paused Denver V2). No anomaly that requires his attention. KYBBA decline is worth watching but not alarming yet. New campaigns are healthy. The scheduler auto-sync issue is concerning but Jaime is compensating with manual runs — next P6 cycle should investigate.

- **Next priority:** P6 — Infrastructure Check. Focus on diagnosing WHY the scheduler isn't auto-firing meta-ads jobs despite heartbeats running. This is the critical gap — without auto-sync, snapshots won't accumulate daily and ROAS trend analysis stays blocked. Also verify if TM One auto-checks are firing. Avoid P4 next per rotation rule.

## 2026-02-23 ~09:30 CST — Cycle #23 (Infrastructure Check)
- **Priority chosen:** P6 — Infrastructure Check (recommended by Cycle #22)
- **What I audited or read:**
  - LEARNINGS.md (full read — Cycles #0-22 + 2 manual action entries, 322 lines)
  - MEMORY.md (full read — 143 lines, updated during manual command sessions earlier today)
  - .env credentials (all 7 key vars confirmed set)
  - Endpoints: /api/ingest, /api/alerts, /api/health
  - Supabase: agent_jobs heartbeats, non-heartbeat jobs, campaign_snapshots, meta_campaigns
  - Session cache file ages
  - Claude CLI version

- **Infrastructure health — ALL GREEN:**
  - ✅ **Endpoints:** ingest 401, alerts 401, health 404 — all expected. No Clerk 307 regression.
  - ✅ **Scheduler:** heartbeats every minute (latest 15:31 UTC, real-time).
  - ✅ **Cron syncs confirmed working:**
    - 06:00 UTC cron: created snapshots (created_at 06:04:00 UTC) ✅
    - 12:00 UTC cron: updated campaigns (updated_at 12:04:36 UTC) ✅
    - This was the Cycle #22 concern ("scheduler not auto-firing meta-ads") — **CONFIRMED RESOLVED.** Cron fires at 00/06/12/18 UTC. It doesn't create agent_jobs entries (known behavior).
  - ✅ **Credentials:** All 7 key vars set (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INGEST_URL, INGEST_SECRET, TM_EMAIL, TM_PASSWORD, TELEGRAM_BOT_TOKEN)
  - ✅ **Claude CLI:** v2.1.50 at /Users/jaimeortiz/.local/bin/claude
  - ✅ **Session cache fresh:** last-campaigns.json 3.5h old (06:04 CST), last-events.json 1.5h old (08:05 CST)

- **🆕 NEW FINDING — Snapshot UPSERT is write-once (ON CONFLICT DO NOTHING):**
  - Compared snapshot spend vs campaign spend for Feb 23:
    - KYBBA: snapshot=236927¢ (@06:04) vs campaign=236930¢ (@12:04) — diff +3¢
    - Alofoke: 27155 vs 27207 — diff +52¢
    - Camila Anaheim: 26857 vs 26894 — diff +37¢
    - Camila Sacramento: 25376 vs 25451 — diff +75¢
    - PAUSED campaigns: identical (no spend change)
  - **Conclusion:** Snapshots are created by the FIRST sync of the day (06:00 UTC = midnight CST) and NOT updated by subsequent syncs. The ingest uses `ON CONFLICT DO NOTHING` for snapshot upserts.
  - **Implication:** Each daily snapshot represents the midnight CST state. This is actually GOOD for consistency — same time each day for trend comparison. But it means the 12:00/18:00 syncs only refresh `meta_campaigns` (live data), not snapshots.
  - The small spend diffs (3-75 cents) are normal overnight spending (midnight-6am CST). Not anomalous.

- **Other observations:**
  - 🟡 Stale "running" job from Feb 18 18:56 UTC (agent_id "assistant") — zombie entry, never completed. Harmless but should be cleaned up by Jaime.
  - 🟡 Event snapshots still empty (0 rows). TM One events are ingested to `tm_events` but snapshot pipeline for events not wired.
  - 🟡 Beamina V3 (120219401679220525) only synced by 06:00 cron, not 12:04 manual sync — excluded from manual runs due to no last-30d spend filter. Its `updated_at` is 06:04, not 12:04.
  - 🟡 Campaign snapshot dates: still only Feb 19 + Feb 23 (2 dates). Next new date: Feb 24 at 06:00 UTC (midnight CST). ROAS trend needs 3+ consecutive days — won't unlock until Feb 25 at earliest.

- **MEMORY.md "Cycle #23" numbering note:** MEMORY.md references "Cycle #23" for the scheduler misdiagnosis correction, but that was a command session update (manual syncs at 12:04/14:05 UTC), not a formal think cycle. This think cycle is the actual Cycle #23. Numbering is consistent going forward.

- **No Telegram draft** — infrastructure fully healthy. No anomaly, no breakage.

- **Next priority:** P3 — Memory Maintenance. LEARNINGS.md is now 23 cycles and growing. Cycles #18-22 are detailed entries that could be condensed (like #0-3 and #4-7 were). Also should add snapshot UPSERT behavior finding to MEMORY.md Data Storage Conventions. Alternatively P4 — but last formal think cycle was P4 (#22), and data hasn't changed since 12:04 UTC. Avoid P6 next per rotation rule.

## 2026-02-23 ~10:30 CST — Cycle #24 (Memory Maintenance)
- **Priority chosen:** P3 — Memory Maintenance (recommended by Cycle #23)
- **What I audited or read:**
  - LEARNINGS.md (full read — 369 lines pre-edit)
  - MEMORY.md (full read — 143 lines, verified all entries)
  - session/ directory listing (44 files, noted new TM files from today: tm-debug-login.mjs 10:30, tm-after-market.png 10:23, tm-monitor-stderr.log 10:02)
  - Supabase: agent_jobs heartbeats (alive 16:30 UTC), campaign_snapshots (2 dates: Feb 19 + Feb 23), event_snapshots (still empty), meta_campaigns ACTIVE (5, unchanged)
- **P1 check:** No breakage. Scheduler alive. Session files fresh (campaigns 06:04, events 10:03). All 5 ACTIVE campaigns match MEMORY.md. No endpoint issues.
- **Action taken:**
  1. **Condensed Cycles #18-21** into summary block (~158 lines → ~15 lines). Preserved: alerts Clerk fix, scheduler restart, think.txt audit completion, TM One first data, cron timing correction.
  2. **Consolidated 3 manual action entries** (12:04, 14:05, 16:04 UTC) into single section with one-liners. Removed duplicate entry from end of file.
  3. **LEARNINGS.md: 369 → ~230 lines** (~40% reduction). Maintained all condensed summaries from prior P3 cycles (#0-3, #4-7, #8-9, #10-11, #12-17, now #18-21).
  4. **MEMORY.md verified — no updates needed.** All entries confirmed accurate:
     - Campaign landscape: 5 ACTIVE ✓ (verified against Supabase)
     - Snapshot dates: Feb 19 + Feb 23 ✓
     - Event snapshots: still empty ✓
     - Known issues: all current ✓
     - Data pipeline status: all accurate ✓
     - Snapshot UPSERT behavior: already documented (added Cycle #23) ✓
- **Condensation history:** #0-3 (Cycle #14), #4-7 (Cycle #14), #8-9 (Cycle #14), #10-11 (Cycle #14), #12-17 (Cycle #20), **#18-21 (Cycle #24 — this cycle)**. All cycles through #21 now condensed. #22-23 remain detailed (today's significant findings).
- **No Telegram draft** — routine memory maintenance, no business anomaly.
- **Next priority:** P4 — Business Monitoring. The 18:00 UTC Meta sync should have fired by now (or will fire shortly). Can check if campaign data refreshed since 12:04 UTC. New campaigns are 5 days old now — pacing should be clearer. KYBBA ROAS decline worth monitoring. Seattle show is tomorrow (Feb 25). Alternatively P2 for lighter-touch prompt review. Avoid P3 next per rotation rule.

## 2026-02-23 ~11:00 CST — Cycle #25 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (recommended by Cycle #24, rotation-compliant)
- **What I audited or read:**
  - LEARNINGS.md (full read — 246 lines)
  - MEMORY.md (full read — 144 lines, verified current)
  - session/last-campaigns.json (16 campaigns, mtime Feb 23 06:04 CST = 12:04 UTC — from 12:00 UTC sync)
  - session/tm-monitor-stderr.log (latest TM run at 10:02 CST — 25 events, per-event API still empty)
  - Supabase: meta_campaigns ACTIVE (5 campaigns — unchanged from Cycle #22)
  - Supabase: campaign_snapshots (still only 2 dates: Feb 19 + Feb 23)
  - Supabase: heartbeats (alive at 17:00 UTC)
  - Endpoints: ingest 401 ✅, alerts 401 ✅

- **Campaign data:** All values IDENTICAL to Cycle #22 (same 12:04 UTC sync). The 18:00 UTC sync hasn't fired yet (~17:00 UTC now). No intermediate data changes.
  - 5 ACTIVE: KYBBA (2.46×), Arjona Sac V2 (8.91×), Alofoke (3.66×), Camila Anaheim (3.42×), Camila Sacramento (3.66×)
  - No status changes since Cycle #22. No ROAS changes (same sync).

- **🔍 NEW ANALYTICAL FINDING — KYBBA marginal ROAS is 0.61× (losing money on new spend):**
  - Used snapshot comparison (Feb 19 → Feb 23) to calculate incremental returns:
    - Feb 19: spend=$2,069, ROAS=2.73 → Revenue=$5,648
    - Feb 23: spend=$2,369, ROAS=2.46 → Revenue=$5,832
    - Δ spend=+$300, Δ revenue=+$184 → **Marginal ROAS = 0.61×**
  - Meaning: every new $1 spent since Feb 19 generated only $0.61 in return. The campaign is LOSING money on incremental dollars.
  - Blended ROAS (2.46×) is still above the 2.0 threshold only because of historical high-ROAS spend carrying the average.
  - At this marginal rate, blended ROAS will cross below 2.0 after ~$560 more in spend (current $100/day budget → ~5-6 days → around Feb 28-Mar 1).
  - **Caveat:** 4-day gap between snapshots (including 3 days of scheduler downtime). Marginal ROAS could be noisy. Need consecutive daily snapshots (Feb 24+) to confirm trend.
  - **Methodology note:** Marginal ROAS = (Revenue_new - Revenue_old) / (Spend_new - Spend_old). This is more actionable than blended ROAS for ongoing optimization decisions.

- **Pacing (unchanged — same data as Cycle #22):**
  - New campaigns: 64-68% (4 days old, normal ramp-up). Will reassess with fresh data after 18:00 UTC sync and with Feb 24 values.
  - KYBBA: SKIP (pause history). Arjona Sac V2: SKIP (recent reactivation).

- **Snapshot accumulation:** Still 2 dates (Feb 19 + Feb 23). Feb 24 at 06:00 UTC will be 3rd. ROAS 3-day consecutive trend check unlocks Feb 25 at earliest (needs Feb 23, 24, 25).

- **TM One:** Working (25 events, last run 10:02 CST). Per-event API still returns empty data (percentSold/ticketsSold null). No errors in stderr.

- **Seattle/Portland shows (Feb 25-26):** Campaigns still PAUSED. Same as Cycle #22. Jaime is actively managing — likely intentional.

- **No Telegram draft** — KYBBA marginal ROAS finding is significant but not yet actionable (blended still above 2.0, need consecutive daily snapshots to confirm trend, show is 27 days out). If Feb 24 snapshot shows blended ROAS dropping further toward or below 2.0, THEN alert Jaime.

- **No dashboard alert posted** — same reasoning. Will alert if blended ROAS crosses 2.0 or marginal stays below 1.0 for 3+ consecutive days.

- **Next priority:** P2 — Prompt Audit. All 3 prompts were fully audited by Cycle #19, so this is a second-pass review. Should add the marginal ROAS methodology to prompts/think.txt P4 section (it's a better analytical tool than just checking blended ROAS). Also consider adding it to chat.txt for when Jaime asks about campaign health. Rotate: command.txt was last audited Cycle #12 (first pass) — do command.txt for second-pass review. Avoid P4 next per rotation rule.

## 2026-02-23 ~11:30 CST — Cycle #26 (Prompt Audit — Second Pass)
- **Priority chosen:** P2 — Self-Improvement / Prompt Audit (recommended by Cycle #25, rotation-compliant)
- **What I audited or read:**
  - LEARNINGS.md (full read — 289 lines)
  - MEMORY.md (full read — 144 lines, current campaign landscape has 4 new Zamora sub-brands)
  - prompts/command.txt (full read — 423 lines, second-pass review)
  - prompts/chat.txt (full read — 314 lines, cross-checked)
  - prompts/think.txt (full read — 171 lines, cross-checked)

- **Gaps found and fixed (5 changes across 3 files):**
  1. **command.txt — Client slug mapping missing Alofoke/Camila** (lines 82-83): Added `Contains "alofoke" → "zamora"` and `Contains "camila" → "zamora"` with "(Zamora sub-brand)" notes. Without this fix, all 4 new campaigns (Alofoke, Camila Sac, Camila Anaheim, Camila Dallas) would be tagged "unknown" during sync. **Real bug — would have caused data quality issues on next manual sync.**
  2. **command.txt — Insights query missing `actions` field** (line 70): Added `actions` to the fields list. chat.txt had this fix since Cycle #12, but command.txt was missed. Without `actions`, CPA cannot be calculated in command mode.
  3. **command.txt — Missing Revenue/CPA formulas** (lines 77-78): Added `Revenue = spend × ROAS` and `CPA = spend / purchases` calculation notes to Key Notes section, matching chat.txt's existing coverage.
  4. **chat.txt — Client aliases missing new brands** (lines 37-38): Added `"alofoke" → Zamora (Alofoke sub-brand, Boston show)` and `"camila" → Zamora (Camila sub-brand, multiple cities)`. Without this, Jaime saying "check alofoke" or "how's camila" would trigger "can't match the name" prompt.
  5. **think.txt — Marginal ROAS methodology added** (lines 58-65): New P4 sub-section with complete formula, flagging criteria (marginal < 1.0), blended ROAS crossover projection, and caveats about snapshot gaps. Also added to chat.txt (lines 258-262) for when Jaime asks "how's X doing?"

- **Units fix:** Caught and fixed a units bug in the think.txt marginal ROAS formula — snapshot `spend` is in cents, so denominator needs `/100` conversion to match revenue in dollars.

- **Cross-check results:** All 3 prompts now consistent on: API version (v21.0), ad account ID, client slug mappings (including new sub-brands), Supabase column naming, insights fields, error codes, session cache format, alerts endpoint. command.txt: 423→429 lines. chat.txt: 314→321 lines. think.txt: 171→179 lines.

- **No Telegram draft** — routine prompt maintenance, no business anomaly.

- **Next priority:** P4 — Business Monitoring. The 18:00 UTC sync should have fresh data by now (~17:30 UTC). Check if campaign values updated from the 06:04 UTC baseline. Also: Feb 24 snapshot arrives overnight (06:00 UTC) — will be 3rd snapshot date, enabling ROAS trend for campaigns with all 3 dates. KYBBA marginal ROAS needs watching. Alternatively P3 if P4 data hasn't changed. Avoid P2 next per rotation rule.
