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
- **12:04 UTC:** Manual Meta sync — 16 campaigns (5 ACTIVE, 11 PAUSED). 4 new campaigns, Denver V2 PAUSED, Arjona Sac V2 reactivated.
- **14:05/16:04 UTC:** Manual TM One runs — 25 events, no changes. Sacramento Arjona still missing from GraphQL.

## 2026-02-23 — Cycles #22-28 Summary (First Full Day of Fresh Data)

> Condensed from 7 detailed entries during Cycle #29 memory maintenance. See git history for originals.

- **Cycle #22 (P4 — first fresh data):** Campaign landscape transformed: 5→5 ACTIVE but entirely different mix. **Denver V2 PAUSED** (show past, 9.82× ROAS). **4 NEW Zamora campaigns** appeared (all started Feb 19): Alofoke (3.66×, Boston Mar 2), Camila Sacramento (3.66×), Camila Anaheim (3.42×), Camila Dallas (killed, $0.30). **Arjona Sac V2 reactivated** (8.91×). KYBBA declining: 2.73→2.46×. New campaigns 64-68% pacing (normal ramp-up). Seattle/Portland shows imminent with PAUSED campaigns (likely intentional). MEMORY.md comprehensively updated.
- **Cycle #23 (P6 — infra check):** **ALL GREEN.** Cron syncs confirmed working (06:00/12:00 UTC — resolved Cycle #22's false alarm). Snapshot UPSERT is write-once (ON CONFLICT DO NOTHING) — each daily snapshot reflects midnight CST state. Beamina V3 only in 06:00 sync (excluded from manual runs). Zombie job from Feb 18 noted. Claude CLI v2.1.50.
- **Cycle #24 (P3 — memory maintenance):** Condensed Cycles #18-21 (~158→15 lines). LEARNINGS.md 369→230 lines. MEMORY.md verified accurate — no updates needed.
- **Cycle #25 (P4 — marginal ROAS discovery):** **🔑 KYBBA marginal ROAS = 0.61×** — losing money on incremental spend. Feb 19→23: Δspend=$300, Δrevenue=$184. Blended (2.46×) carried by historical performance. Projects to cross 2.0 threshold ~Feb 28. Caveat: 4-day snapshot gap makes this noisy. Methodology documented in prompts.
- **Cycle #26 (P2 — prompt second-pass):** **5 fixes across 3 files**: (1) command.txt client slug mapping missing alofoke/camila→zamora (**real bug — would tag campaigns "unknown"**), (2) command.txt missing `actions` field for CPA, (3) command.txt missing Revenue/CPA formulas, (4) chat.txt missing alofoke/camila aliases, (5) think.txt+chat.txt: added marginal ROAS methodology. Units bug fixed in think.txt (snapshot spend in cents). All 3 prompts cross-checked consistent.
- **Cycle #27 (P4 — 18:00 UTC sync):** **Arjona Sac V2 ACTIVE→PAUSED** (Jaime, intentional). Now 4 ACTIVE. **Pipeline gap found**: sync only pushes ACTIVE data to Supabase — PAUSED campaigns keep stale ACTIVE status. Elevated to Known Issue #2. **Meta intraday reporting lag confirmed**: <3% of expected daily spend shows after 12h (normal API behavior). ROAS: KYBBA 2.46× flat, others healthy (3.4-3.7×). MEMORY.md updated.
- **Cycle #28 (P5 — proposals overhaul):** Complete proposals.md rewrite: 6 old (4 completed, 2 superseded) → 6 new ranked A-F. Top: **A: Campaign-Event Auto-Linking** (highest value — connects ad spend to ticket sales, now unblocked), B: Show Countdown Dashboard, C: Marginal ROAS in Dashboard, D: PAUSED Status Sync Fix (quick), E: Creative-Level Performance, F: Budget Recommendation Engine.

**Key findings preserved from Cycles #22-28:**
- Campaign landscape: 17 total, 4 ACTIVE (KYBBA, Alofoke, Camila Ana, Camila Sac), 13 PAUSED
- 🔑 KYBBA marginal ROAS 0.61× — watch closely, blended crosses 2.0 ~Feb 28 at current rate
- 🔑 Snapshot UPSERT = write-once at midnight CST. Intraday deltas unreliable.
- 🔑 PAUSED campaigns don't get status updated in Supabase (pipeline gap, code fix needed)
- 🔑 Client slug bug fixed in prompts — alofoke/camila now map to "zamora"
- All 3 prompts completed second full audit cycle by Cycle #26
- Proposals A-F drafted with campaign-event linking as #1 priority
- Condensation history: #0-3, #4-7, #8-9, #10-11 (Cycle #14), #12-17 (Cycle #20), #18-21 (Cycle #24), **#22-28 (Cycle #29)**

## 2026-02-23 ~13:30 CST — Cycle #29 (Memory Maintenance)
- **Priority chosen:** P3 — Memory Maintenance (recommended by Cycle #28, rotation-compliant — last was P5)
- **What I audited or read:**
  - LEARNINGS.md (full read — 390 lines pre-edit, Cycles #0-28)
  - MEMORY.md (full read — 147 lines, verified all entries current)
  - Supabase: heartbeats (alive at 19:30 UTC), endpoints (ingest 401 ✅, alerts 401 ✅)
  - Session cache: last-campaigns.json mtime 12:02 CST (18:02 UTC), last-events.json mtime 12:02 CST — both fresh
- **P1 check:** No breakage. Scheduler alive. All endpoints responding. No errors.
- **Action taken:**
  1. **Condensed Cycles #22-28** (7 entries, ~282 lines) into summary block (~25 lines). Preserved: campaign landscape transformation, KYBBA marginal ROAS finding, snapshot write-once behavior, PAUSED pipeline gap, client slug bug fix, Meta reporting lag, proposals A-F overhaul.
  2. **Consolidated manual action entries** (3 lines → 2 lines).
  3. **LEARNINGS.md: 390 → ~140 lines** (~64% reduction). All cycles through #28 now condensed. Only this entry (#29) remains detailed.
  4. **MEMORY.md verified — no updates needed.** All entries confirmed accurate against current state (4 ACTIVE campaigns, known issues ranked, data pipeline status, proposals A-F).
- **No Telegram draft** — routine memory maintenance, no business anomaly.
- **Next priority:** P4 — Business Monitoring. The Feb 24 snapshot arrives at 06:00 UTC (midnight CST) — this will be the 3rd snapshot date (Feb 19, 23, 24), enabling marginal ROAS recalculation for KYBBA with consecutive days. First P4 cycle on Feb 24 will be the most impactful of the week. Until then, P6 or P2 are lower-value alternatives. Avoid P3 next per rotation rule.

---

## 2026-02-23 — Manual Sessions Summary (command-mode, not think cycles)

> Condensed during Cycle #35 memory maintenance.

**Targeting + Ad Fix (afternoon session):**
- **Trigger:** Buyer zip code analysis showed 297 sales from SF Bay Area, spread beyond 25-mile radii.
- Sacramento: radius 25→50mi (all 6 adsets), new Bay Area adset created (120242461121430525, 40mi around Oakland)
- Anaheim: radius 25→40mi (all 6 adsets)
- **3 ads fixed** — deprecated 191x100 crop key (error 2490085) silently blocked delivery. New replacement ads created. Fix documented in command.txt + MEMORY.md.
- API patterns learned: adset updates via `-F` multipart, adset creation via `--data-urlencode` to `act_{ID}/adsets`, CBO=no daily_budget on adsets, don't reuse adlabel names, duplicate hash rejection. All documented in command.txt + chat.txt (Cycle #31).

**KYBBA Deep Dive (~19:00 CST, customer request):**
- Spend: $2,369 | Revenue: $5,832 | ROAS: 2.46× | 50 purchases | CPA: $47.39 | **Budget: $50/day** (⚠️ see note below)
- Checkout drop-off: 520→50 (9.6% conversion, 90% abandonment) — landing page/UX issue
- Best adsets: Video 12 A/B (3.96-4.65× ROAS). Worst: Video 9 ($54 CPA), Video 1 ($44 CPA).
- Recommendations given to Jaime: kill V9+V1, scale V12, monitor V11 (fatiguing at 67% of budget), fresh creatives needed, tighter age targeting.
- Customer asked about scaling to $50/adset (from $50 total campaign).
- ⚠️ **Budget discrepancy**: Deep dive shows $50/day but session cache (18:02 UTC, pre-deep-dive) shows `daily_budget_cents: 10000` ($100/day). Jaime may have changed budget during/after deep dive. **Verify on next sync (00:00 UTC Feb 24).**

## 2026-02-23 — Cycles #30-34 Summary (Stable Day, Prompt & Proposal Work)

> Condensed from 5 detailed entries during Cycle #35 memory maintenance. See git history for originals.

- **Cycle #30 (P4 — monitoring):** All 4 ACTIVE campaigns checked. ROAS: Alofoke 3.66×, Camila Sac 3.65×, Camila Ana 3.41× (all healthy), KYBBA 2.46× (declining). Pacing: new campaigns 64-68% (normal ramp-up), KYBBA skipped (pause history). **KYBBA marginal ROAS confirmed 0.61×**, projection updated: blended crosses 2.0 ~Mar 3. PAUSED attribution shifts noted (Portland ROAS 7.88→9.21, Happy Paws spend reversal). MEMORY.md updated.
- **Cycle #31 (P2 — prompt audit):** **command.txt +53 lines** (Adset & Targeting Operations section: list/read/update/create adsets, CBO behavior, bulk workflows). **chat.txt +24 lines** (targeting patterns). All patterns from manual session now documented. Cross-checked: pixel ID, ad account, API version consistent.
- **Cycle #32 (P4 — monitoring):** Data identical to Cycle #30 (no new sync). Confirmed: no new calculations possible until Feb 24 snapshot.
- **Cycle #33 (P6 — infra check):** **ALL GREEN.** .env 7/7 vars ✅, Claude CLI v2.1.50 ✅, endpoints alive ✅, scheduler heartbeats ✅, Meta cron (18:00 UTC) + TM cron (22:00 UTC) both confirmed by file mtime + Supabase ✅. Snapshots: 30 rows, 2 dates (Feb 19 + Feb 23).
- **Cycle #34 (P5 — proposals):** Added Proposal G (Ad Health Scan — auto-detect `WITH_ISSUES` ads) and Proposal H (Post-Show Reports). Ranking updated: G→D→A→C→B→H→E→F. Proposals.md now has 8 proposals (4 completed + 8 active = overhaul from 6 original).

**Key findings preserved from Cycles #30-34:**
- KYBBA marginal ROAS confirmed 0.61× (Cycle #30), projection: blended crosses 2.0 ~Mar 3
- All 3 prompts completed third partial audit cycle (command.txt + chat.txt updated Cycle #31, think.txt untouched)
- Proposals expanded to 8 (G: Ad Health Scan, H: Post-Show Reports). Ranking: G→D→A→C→B→H→E→F
- Infrastructure fully verified (Cycle #33) — all systems operational
- Feb 24 snapshot (06:00 UTC) = first consecutive daily data, highest-impact monitoring cycle upcoming
- Condensation history: #0-3, #4-7, #8-9, #10-11 (Cycle #14), #12-17 (Cycle #20), #18-21 (Cycle #24), #22-28 (Cycle #29), **#30-34 (Cycle #35)**

## 2026-02-23 ~17:30 CST — Cycle #35 (Memory Maintenance)
- **Priority chosen:** P3 — Memory Maintenance (rotation-compliant — last was P5 Cycle #34, last P3 was Cycle #29)
- **P1 check:** No breakage. Scheduler alive (heartbeat 23:30 UTC). Session cache: campaigns 18:02 UTC, events 22:08 UTC. Snapshots: still 2 dates (Feb 19 + Feb 23). All systems operational.
- **What I audited or read:**
  - LEARNINGS.md (full read — 355 lines pre-edit, Cycles #0-34 + 2 manual session entries)
  - MEMORY.md (full read — 162 lines, found 2 discrepancies)
  - Session cache: KYBBA `daily_budget_cents: 10000` ($100/day) vs deep dive "$50/day" — budget change pending verification
  - Supabase: heartbeats alive, snapshots unchanged (2 dates)
- **Action taken:**
  1. **Condensed Cycles #30-34** (5 entries, ~140 lines) into summary block (~15 lines). Preserved: KYBBA marginal ROAS confirmation, prompt audit gains, infra all-green, proposals G+H, Feb 24 data anticipation.
  2. **Condensed 2 manual session entries** (~70 lines → ~20 lines). Preserved: targeting radius changes, Bay Area adset creation, 3 ad fixes, KYBBA deep dive metrics + recommendations, budget discrepancy flag.
  3. **Fixed Cycle #33/#34 ordering** — were written out of order in LEARNINGS.md, now condensed into correct sequence.
  4. **LEARNINGS.md: 355 → ~195 lines** (~45% reduction). All cycles through #34 + manual sessions now condensed.
  5. **MEMORY.md updates needed** (see below): proposals count (6→8), KYBBA budget verification note, KYBBA recommendations reference.
- **MEMORY.md discrepancies found:**
  - Line 144: "6 ranked capability proposals" — should be "8" (G+H added Cycle #34)
  - KYBBA entry: "$100/day budget" — may now be $50/day (deep dive shows $50, session cache pre-dates change). Flag for verification.
  - KYBBA section should reference adset-level recommendations given to Jaime (kill V9+V1, scale V12)
- **No Telegram draft** — routine memory maintenance, no business anomaly.
- **Next priority:** P4 — Business Monitoring. **Feb 24 snapshot at 06:00 UTC (midnight CST) is the highest-impact data point yet.** Enables: consecutive-day marginal ROAS for KYBBA, first marginal ROAS for Alofoke/Camila, targeting change impact signal. Also: 00:00 UTC sync (30 min from now) will refresh session cache — may reveal KYBBA budget change. Avoid P3 next per rotation.

## 2026-02-24 ~00:30 UTC — Cycle #36 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (recommended by Cycle #35, rotation-compliant — last was P3)
- **P1 check:** No breakage. Scheduler alive (heartbeat 00:30 UTC). Endpoints: ingest 401 ✅, alerts 401 ✅. No errors.
- **What I audited or read:**
  - LEARNINGS.md (full read, 204 lines)
  - MEMORY.md (full read, 162 lines)
  - Session cache: last-campaigns.json (mtime Feb 23 18:02 CST — 6.5h old)
  - Supabase: campaign_snapshots (3 dates: Feb 19, 23, 24 — **Feb 24 is NEW**)
  - Supabase: meta_campaigns (4 ACTIVE, all PAUSED correctly showing PAUSED status)
  - Supabase: agent_jobs (heartbeats current at 00:30 UTC)
- **Key findings:**
  1. **✅ Feb 24 snapshots arrived** — 3rd snapshot date (Feb 19, 23, 24). 15 campaigns have snapshots for all 3 dates. New Zamora campaigns (Alofoke, Camila Ana, Camila Sac) have 2 dates (Feb 23, 24).
  2. **✅ KYBBA budget CONFIRMED $50/day** — Session cache: `daily_budget_cents: 5000`. Supabase: `daily_budget: 5000`. Both match. Resolves Cycle #35 budget discrepancy flag.
  3. **✅ Known Issue #2 RESOLVED** — PAUSED campaigns now correctly show `status: PAUSED` in Supabase with `updated_at: 00:02 UTC Feb 24`. All 5 checked PAUSED campaigns had correct status. The sync now pushes ALL campaigns (not just ACTIVE). Marking resolved.
  4. **📊 KYBBA marginal ROAS unchanged at 0.61×** (Feb 19→24, 5-day gap): Δspend=$300.31, Δrevenue=$183.72. Blended 2.46× carried by historical. Projection updated: blended crosses 2.0 ~**Mar 12** at $50/day ($786 additional spend needed at 0.61× marginal). 10 days before show (Mar 22).
  5. **⚠️ Consecutive-day marginal ROAS unreliable** — Feb 23→24 deltas are $0.22-$1.43 per campaign vs $50-100/day budgets. This is Meta reporting lag (documented behavior). Need 2+ day gaps between snapshots for meaningful marginal analysis. New Zamora campaigns (Alofoke, Camila) need Feb 25+ snapshots for first marginal ROAS.
  6. **📊 00:00 UTC sync confirmed** — Supabase `updated_at` on all campaigns = 00:02 UTC Feb 24. Snapshot write-once captured at this time. Session cache NOT updated by this sync (mtime unchanged from 18:02 UTC) — possible timing issue or session write only on select sync types.
  7. **📊 No status changes** — Same 4 ACTIVE (KYBBA, Alofoke, Camila Ana, Camila Sac). No PAUSED→ACTIVE.
- **Action taken:**
  1. Updated MEMORY.md: KYBBA budget confirmed $50/day, Known Issue #2 resolved, snapshot count updated to 3 dates, KYBBA projection updated to Mar 12, session cache count corrected (15 not 16), consecutive-day reporting lag caveat added.
  2. Logged Cycle #36 in LEARNINGS.md.
- **No Telegram draft** — KYBBA decline already flagged to Jaime with budget reduction + adset recommendations. No new business anomaly.
- **Next priority:** P2 — Prompt Audit. Think.txt hasn't been touched since Cycle #19 (3rd audit was partial — only command.txt + chat.txt done in Cycle #31). Or P6 if something looks off. Avoid P4 next per rotation.
