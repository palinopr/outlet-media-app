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

## 2026-02-18 — Cycles #8-9 Summary (Monitoring + general.txt Audit)

> Condensed from 2 detailed entries during Cycle #14 memory maintenance.

- **Cycle #8 (P4 — Business Monitoring):** 1 ACTIVE (Denver V2 ROAS 8.40×), 12 PAUSED. No anomalies. Pacing/ROAS trend/TM One all SKIPPED (pipeline gaps still present pre-Feb-19 sync). `/api/health` confirmed as 404 (endpoint doesn't exist — not critical). Ingest endpoint alive (401 on unauthenticated POST).
- **Cycle #9 (P2 — Prompt Audit: general.txt):** Fixed 6 gaps in general.txt: (1) missing `purchase_roas` parsing guide, (2) missing Revenue/CPA formulas, (3) missing error handling with Meta error codes, (4) incomplete write verification fields, (5) missing Supabase REST reference, (6) missing Alerts endpoint. Also added `date_preset=today` empty response fallback. File grew 236→291 lines. All 3 prompts cross-checked — fully consistent.

## 2026-02-19 — Cycles #10-11 Summary (First Pacing + Infra Audit)

> Condensed from 2 detailed entries during Cycle #14 memory maintenance. See git history for originals.

- **Cycle #10 (P4 — Business Monitoring):** First pacing check (now unblocked). Denver V2 at **37.3% pacing** ($2,240 of $6,000 expected over 8 days × $750/day) — underpacing flag. KYBBA pacing skipped (extensive pause history makes raw pacing meaningless). Discovered **spend freeze**: both ACTIVE campaigns at identical spend for 24+ hours. Discovered **/api/alerts blocked by Clerk auth** (307 redirect — needs `publicRoutes` fix in `middleware.ts`, Jaime's Next.js app). Noted pacing methodology limitation: start_time-based formula fails for campaigns with pause history; daily spend deltas from snapshots are better (future improvement). Drafted an owner note with findings.
- **Cycle #11 (P6 — Infrastructure Check):** Full credential audit (all set except TM One). Endpoint health: `/api/health` GET → 404 (definitive: endpoint doesn't exist), `/api/ingest` POST → 401/400 ✅ (alive), `/api/alerts` POST → 307 ❌ (Clerk bug persists). Claude CLI at v2.1.47. Session cache fresh (06:03, within 24h). **Data consistency verified**: session cache ↔ Supabase values match for Denver V2 and KYBBA (spend, daily_budget, start_time). Pipeline healthy end-to-end. Noted Supabase column is `name` not `campaign_name`.

**Key findings preserved:**
- 🔴 `/api/alerts` Clerk auth bug — blocks all dashboard alerts (persisted Cycles #10-11). Fix: add `/api/alerts` to `publicRoutes` in `middleware.ts`
- 🔴 Spend freeze: Denver V2 stuck at $2,240, KYBBA at $2,069 for 24+ hours. Sync running but Meta returning same values
- Pacing methodology: start_time-based formula unreliable for campaigns with pause history → use daily spend deltas from snapshots when available
- Claude CLI: v2.1.47 at `/Users/jaimeortiz/.local/bin/claude`
- `/api/health` definitively returns 404 — endpoint doesn't exist, not critical

## 2026-02-19 — Cycles #12-17 Summary (Prompt Completion + Scheduler Crisis)

> Condensed from 6 detailed entries during Cycle #20 memory maintenance. See git history for originals.

- **Cycle #12 (P2 — command.txt audit):** Fixed 4 gaps: (1) verify-after-write missing `effective_status`+`lifetime_budget`, (2) error handling lacked specific Meta error codes (190, 32/4/17, 100, 10/200), (3) Supabase section missing ACTIVE filter/snapshot queries/column naming, (4) session cache missing freshness guidance (bare JSON, use mtime). Also fixed general.txt missing `actions` field in insights query (broke CPA calculations). Added column naming note to MEMORY.md. command.txt: 294→316 lines.
- **Cycle #13 (P4 — monitoring):** Data 6.5h old. Denver V2 ROAS 9.82× ($2,240, $750/day), KYBBA 2.73× ($2,069, $100/day). Denver pacing at 33% — severely underpacing. **🔴 Spend freeze escalated**: both campaigns at identical spend for 30+ hours. `/api/alerts` still 307 (3rd cycle).
- **Cycle #14 (P3 — memory maintenance):** Condensed Cycles #0-3, #4-7, #8-9, #10-11 into summaries. Updated MEMORY.md with campaign landscape, data pipeline status, known issues. Forgot to log its own entry (reconstructed retroactively).
- **Cycle #15 (P6 — infrastructure check):** 🔴 **CRITICAL: Agent scheduler NOT running.** No process in ps aux. Last heartbeat Feb 18 21:11 UTC (~23h ago). Session cache from desktop app (separate project). Impact: no syncs, no heartbeats, no think cycles, snapshots won't accumulate. `/api/alerts` still 307 (5th cycle). All creds OK except TM One blank. Drafted an owner alert.
- **Cycle #16 (P2 — general.txt audit):** Fixed 3 gaps: (1) context bleed warning missing, (2) Supabase section too basic (added column naming, ACTIVE filter, snapshot queries, daily_budget/start_time to default select), (3) session cache freshness note missing. general.txt: 291→314 lines. All 3 prompts cross-checked consistent.
- **Cycle #17 (P4 — monitoring):** Data 10h stale. Scheduler confirmed still down (25h+ no heartbeat). Spend freeze now 40+ hours. Diagnostic blind spot: can't distinguish "Meta returning frozen data" vs "we're not checking." Discovered correct Supabase column names (`campaign_snapshots.spend` not `spend_cents`, `agent_jobs.agent_id` not `job_type`). Updated MEMORY.md with column mappings.

**Key outcomes preserved:**
- All 3 prompt files completed first full audit cycle (command.txt #12, general.txt #16, think.txt #19)
- Context bleed protection added to command.txt (#12) and general.txt (#16), think.txt (#19)
- Supabase column naming documented across all files: `name` not `campaign_name`, `spend` not `spend_cents`, `agent_id` not `job_type`
- 🔴 Scheduler was down Feb 18 15:11 → Feb 22 19:12 CST (76h gap). 3 days of snapshots lost (Feb 20-22).
- 🔴 `/api/alerts` Clerk bug persisted Cycles #10-17 (6 cycles). Fixed by Jaime between Cycles #17-18.
- Spend freeze diagnosis inconclusive — stale data made it impossible to distinguish API lag from real freeze.

## 2026-02-22 — Cycles #18-21 Summary (Post-Restart Recovery)

> Condensed from 4 detailed entries during Cycle #24 memory maintenance. See git history for originals.

- **Cycle #18 (P4 — Business Monitoring):** First cycle after 3-day gap (scheduler down Feb 18-22). Campaign data 3 days stale. **🟢 `/api/alerts` Clerk bug RESOLVED** — returns 200 (was 307 for Cycles #10-17). Jaime fixed Clerk `publicRoutes`. **🟢 Scheduler restarted** (~19:12 CST Feb 22, 76h gap). New `tm-demographics` job type seen. Meta syncs not yet firing. Pacing/ROAS trend suspended (stale data). TM One headless browser scraping under active development (login hitting selector issues).
- **Cycle #19 (P2 — think.txt audit):** Fixed 6 gaps: (1) `scraped_at` reference → use mtime, (2) context bleed warning, (3) pacing methodology limitation for paused campaigns, (4) P6 alerts endpoint test, (5) Supabase column naming for monitoring, (6) TM One session file awareness. think.txt 156→171 lines. **All 3 prompts now fully audited** (command.txt #12, general.txt #16, think.txt #19).
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
- **Cycle #26 (P2 — prompt second-pass):** **5 fixes across 3 files**: (1) command.txt client slug mapping missing alofoke/camila→zamora (**real bug — would tag campaigns "unknown"**), (2) command.txt missing `actions` field for CPA, (3) command.txt missing Revenue/CPA formulas, (4) general.txt missing alofoke/camila aliases, (5) think.txt+general.txt: added marginal ROAS methodology. Units bug fixed in think.txt (snapshot spend in cents). All 3 prompts cross-checked consistent.
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
- **No owner note** — routine memory maintenance, no business anomaly.
- **Next priority:** P4 — Business Monitoring. The Feb 24 snapshot arrives at 06:00 UTC (midnight CST) — this will be the 3rd snapshot date (Feb 19, 23, 24), enabling marginal ROAS recalculation for KYBBA with consecutive days. First P4 cycle on Feb 24 will be the most impactful of the week. Until then, P6 or P2 are lower-value alternatives. Avoid P3 next per rotation rule.

---

## 2026-02-23 — Manual Sessions Summary (command-mode, not think cycles)

> Condensed during Cycle #35 memory maintenance.

**Targeting + Ad Fix (afternoon session):**
- **Trigger:** Buyer zip code analysis showed 297 sales from SF Bay Area, spread beyond 25-mile radii.
- Sacramento: radius 25→50mi (all 6 adsets), new Bay Area adset created (120242461121430525, 40mi around Oakland)
- Anaheim: radius 25→40mi (all 6 adsets)
- **3 ads fixed** — deprecated 191x100 crop key (error 2490085) silently blocked delivery. New replacement ads created. Fix documented in command.txt + MEMORY.md.
- API patterns learned: adset updates via `-F` multipart, adset creation via `--data-urlencode` to `act_{ID}/adsets`, CBO=no daily_budget on adsets, don't reuse adlabel names, duplicate hash rejection. All documented in command.txt + general.txt (Cycle #31).

**KYBBA Deep Dive (~19:00 CST, customer request):**
- Spend: $2,369 | Revenue: $5,832 | ROAS: 2.46× | 50 purchases | CPA: $47.39 | **Budget: $50/day** (⚠️ see note below)
- Checkout drop-off: 520→50 (9.6% conversion, 90% abandonment) — landing page/UX issue
- Best adsets: Video 12 A/B (3.96-4.65× ROAS). Worst: Video 9 ($54 CPA), Video 1 ($44 CPA).
- Recommendations given to Jaime: kill V9+V1, scale V12, monitor V11 (fatiguing at 67% of budget), fresh creatives needed, tighter age targeting.
- Customer asked about scaling to $50/adset (from $50 total campaign). No additional budget available — $50/day is the cap.

## 2026-02-23 — Cycles #30-34 Summary (Stable Day, Prompt & Proposal Work)

> Condensed from 5 detailed entries during Cycle #35 memory maintenance. See git history for originals.

- **Cycle #30 (P4 — monitoring):** All 4 ACTIVE campaigns checked. ROAS: Alofoke 3.66×, Camila Sac 3.65×, Camila Ana 3.41× (all healthy), KYBBA 2.46× (declining). Pacing: new campaigns 64-68% (normal ramp-up), KYBBA skipped (pause history). **KYBBA marginal ROAS confirmed 0.61×**, projection updated: blended crosses 2.0 ~Mar 3. PAUSED attribution shifts noted (Portland ROAS 7.88→9.21, Happy Paws spend reversal). MEMORY.md updated.
- **Cycle #31 (P2 — prompt audit):** **command.txt +53 lines** (Adset & Targeting Operations section: list/read/update/create adsets, CBO behavior, bulk workflows). **general.txt +24 lines** (targeting patterns). All patterns from manual session now documented. Cross-checked: pixel ID, ad account, API version consistent.
- **Cycle #32 (P4 — monitoring):** Data identical to Cycle #30 (no new sync). Confirmed: no new calculations possible until Feb 24 snapshot.
- **Cycle #33 (P6 — infra check):** **ALL GREEN.** .env 7/7 vars ✅, Claude CLI v2.1.50 ✅, endpoints alive ✅, scheduler heartbeats ✅, Meta cron (18:00 UTC) + TM cron (22:00 UTC) both confirmed by file mtime + Supabase ✅. Snapshots: 30 rows, 2 dates (Feb 19 + Feb 23).
- **Cycle #34 (P5 — proposals):** Added Proposal G (Ad Health Scan — auto-detect `WITH_ISSUES` ads) and Proposal H (Post-Show Reports). Ranking updated: G→D→A→C→B→H→E→F. Proposals.md now has 8 proposals (4 completed + 8 active = overhaul from 6 original).

**Key findings preserved from Cycles #30-34:**
- KYBBA marginal ROAS confirmed 0.61× (Cycle #30), projection: blended crosses 2.0 ~Mar 3
- All 3 prompts completed third partial audit cycle (command.txt + general.txt updated Cycle #31, think.txt untouched)
- Proposals expanded to 8 (G: Ad Health Scan, H: Post-Show Reports). Ranking: G→D→A→C→B→H→E→F
- Infrastructure fully verified (Cycle #33) — all systems operational
- Feb 24 snapshot (06:00 UTC) = first consecutive daily data, highest-impact monitoring cycle upcoming
- Condensation history: #0-3, #4-7, #8-9, #10-11 (Cycle #14), #12-17 (Cycle #20), #18-21 (Cycle #24), #22-28 (Cycle #29), **#30-34 (Cycle #35)**

## 2026-02-23/24 — Cycles #35-38 Summary + Manual Sessions

> Condensed from 4 think cycles + 2 manual sessions during Cycle #39 memory maintenance. See git history for originals.

- **Cycle #35 (P3 — memory maintenance):** Condensed Cycles #30-34. Found KYBBA budget discrepancy ($100 vs $50) — flagged for verification. Proposals count corrected to 8.
- **Cycle #36 (P4 — first Feb 24 data):** **✅ Feb 24 snapshots arrived** (3rd date: Feb 19, 23, 24). **✅ KYBBA budget CONFIRMED $50/day** (resolves #35 flag). **✅ Known Issue #2 RESOLVED** — PAUSED campaigns now correctly synced. KYBBA marginal ROAS unchanged 0.61× (Feb 19→24). Consecutive-day snapshot deltas confirmed useless ($0.22-$1.43 on $50-100/day budgets = Meta reporting lag).
- **Cycle #37 (P2 — think.txt audit):** **🔴 Fixed BACKWARDS marginal ROAS guidance** in think.txt — was saying "prefer consecutive daily" but empirical data proves opposite (consecutive-day deltas unreliable). 5 fixes across 3 files (think.txt, general.txt, MEMORY.md). All 3 prompts completed 3rd+ full audit cycle. TM fast scraper (`tm-monitor-fast.mjs`) observed — smart optimization, skips empty ticket API calls.
- **Cycle #38 (P4 — Alofoke surge):** **🟢 Alofoke surged to 8.73×** ROAS ($364 spend, 6 purchases, Boston 6 days out). All Zamora profitable on marginal spend (Camila Sac 6.20×, Ana 4.77×). KYBBA still 0.61-0.95× marginal, crosses 2.0 ~Mar 12-18. **🔑 Snapshot-to-live divergence documented** — all campaigns show higher live ROAS due to delayed attribution. Posted dashboard alert + owner alert.

**Manual sessions (Feb 24):**
- **KYBBA adset swap (Jaime approval):** PAUSED V9 ($54 CPA) + V1 ($44 CPA). ACTIVATED V5 (8.34× today) + Asset 1 (15.92× today). New lineup: V12 A, V12 B, V11, V5, Asset 1. Best day Feb 24: 5 purchases, $77, 5.21× ROAS.
- **Alofoke optimization (Jaime approval):** Budget bumped $100→$250/day (120242224290190525). $250/day × 6 days + $365 = $1,865, under $2K customer cap. PAUSED Michael Flores (0 purchases, $42). ACTIVATED Boston Countdown. Active lineup (6 adsets, CBO): De la Ghetto (51×), Chaval (13.8×), Shadow (12.6×), Perversa (12.0×), Eddie Herrera (9.3×), Countdown.

**Key findings preserved from Cycles #35-38:**
- 🔑 Consecutive-day snapshot deltas proven useless 3x — need 2+ day gaps for marginal ROAS
- 🔑 Snapshot-to-live divergence consistent — live ROAS always higher (delayed attribution). Use snapshots for trends, live for current picture.
- 🔑 All 3 prompts completed 3rd+ full audit cycle, marginal ROAS guidance corrected
- ✅ Known Issue #2 (PAUSED status sync) resolved Cycle #36
- ✅ KYBBA budget confirmed $50/day (was flagged in Cycle #35)
- Condensation history: #0-3, #4-7, #8-9, #10-11 (Cycle #14), #12-17 (Cycle #20), #18-21 (Cycle #24), #22-28 (Cycle #29), #30-34 (Cycle #35), **#35-38 (Cycle #39)**

## 2026-02-24 — Cycles #39-45 Summary (Stable Day, All Systems Operational)

> Condensed from 7 detailed entries during Cycle #46 memory maintenance. See git history for originals.

- **Cycle #39 (P3 — memory maintenance):** Condensed Cycles #35-38. MEMORY.md: 5 updates (Alofoke $250/day + adset lineup, KYBBA swap details, show proximity, campaign timestamp). LEARNINGS.md 307→230 lines. All verified against Supabase.
- **Cycle #40 (P4 — monitoring):** 4 ACTIVE all above 2.0. KYBBA marginal 0.61× (snapshot) / 0.95× (live), crosses 2.0 ~Mar 11-17. **🔑 Snapshot-to-live divergence scales with campaign age** — Alofoke 2.4× gap (youngest), Camila 1.1-1.2×, KYBBA negligible (68 days old). Implication: live marginal more useful for young campaigns. Feb 25 snapshot = last pre-change baseline.
- **Cycle #41 (P6 — infra check):** ALL GREEN. .env 7/7 ✅, CLI v2.1.52, endpoints alive, heartbeats current, cron confirmed. Two TM scrapers: fast (GraphQL-only ✅), full (still tries empty per-event API — not critical).
- **Cycle #42 (P2 — command.txt 4th pass):** +32 lines: custom date ranges, funnel action types (`landing_page_view`, `add_to_cart`, `initiate_checkout`), `frequency` metric + fatigue thresholds, `level=ad` breakdowns, rename/create campaign. general.txt +2 lines. Cross-checked consistent.
- **Cycle #43 (P4 — monitoring):** Data identical to #40. Confirmed Feb 25 snapshot = clean pre-change baseline (KYBBA swap + Alofoke bump both executed AFTER 00:00 UTC snapshot). Post-swap evaluation starts Feb 28.
- **Cycle #44 (P5 — proposals):** Drafted Proposal I (Client Budget Cap Monitor — alert at 80/95/100% of client spend caps) and Proposal J (Campaign Change Journal + Impact Tracker). proposals.md 248→360 lines. 9 active proposals ranked G→I→A→C→J→B→H→E→F.
- **Cycle #45 (P4 — monitoring):** ROAS all above 2.0. KYBBA marginal unchanged 0.61×. **🔑 Alofoke budget cap:** $365/$2K spent (18.2%), projected $1,865 (93.2%) — tight but planned by Jaime. Pacing: Camila 72-76% (improving, normal ramp). Live marginals: Camila Ana 4.79×, Camila Sac 6.26×, Alofoke 23.68× — all strongly profitable.

**Key findings preserved from Cycles #39-45:**
- 🔑 Snapshot-to-live ROAS divergence scales with campaign age — use live for young campaigns, snapshots for trends
- 🔑 Feb 25 snapshot = clean pre-change baseline (both KYBBA swap + Alofoke bump executed after it)
- 🔑 Post-KYBBA swap evaluation: first data Feb 26, first reliable marginal Feb 28
- 🔑 Alofoke $2K cap: $365 spent, projected $1,865 at $250/day × 6 remaining days
- 🔑 KYBBA 2.0× crossing: Mar 12 (conservative) → Mar 18 (live). Show Mar 22. Buffer 4-10 days.
- All 3 prompts completed 4th pass (command.txt Cycle #42, general.txt #42)
- Proposals expanded to 9 (I: Budget Cap Monitor, J: Change Journal). Ranking: G→I→A→C→J→B→H→E→F
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), **#39-45 (#46)**

## 2026-02-24/25 — Cycles #46-53 Summary (Houston Detection + Discord Restructuring)

> Condensed from 8 entries during Cycle #58 memory maintenance. See git history for originals.

- **Cycle #46 (P3 — memory):** Condensed #39-45. KYBBA marginal 0.61× (snapshot) / 0.95× (live). KYBBA swap executed ~01:00 UTC Feb 25. Post-swap evaluation starts Feb 28. Shows: Alofoke Boston Mar 2 (ACTIVE $250/day).
- **Cycle #47 (P4 — monitoring, Feb 25 snapshots):** **🔴 NEW CAMPAIGN: Houston** — $400/day budget, $0 spend, 0 impressions. Alert + owner alert posted. KYBBA marginal improved 0.61→0.95× (Feb 19→25, pre-swap). Zamora marginals all healthy (Alofoke 23.4×, Ana 4.76×, Sac 6.16×). Campaign count 17→18 (5 ACTIVE).
- **Cycle #48 (P2 — general.txt 4th pass):** +30 lines: custom date ranges, level=ad breakdowns, delivery diagnosis workflow, actions field on today query. Cross-checked with command.txt for consistency.
- **Cycle #49 (P3 — memory, retroactive log):** Updated MEMORY.md: pipeline status, known issues, campaign landscape, proposals. Logging gap — reconstructed by Cycle #50.
- **Cycle #50 (P4 — monitoring):** Houston still $0 after 2-8.5h ACTIVE. All other campaigns stable. KYBBA post-swap evaluation deferred to Feb 28.
- **Cycle #51 (P3/P6 — retroactive log):** Updated MEMORY.md: event_snapshots populated (72 rows), CLI v2.1.55. Logging gap — reconstructed by Cycle #52.
- **Cycle #52 (P6 — infra):** ALL GREEN. .env ✅, endpoints ✅, scheduler ✅, CLI ✅, 4 snapshot dates ✅. Houston still $0. Fixed condensation defect (duplicate #41-45 entries). Logging gap pattern identified (sessions ending before writing).
- **Cycle #53 (P4/P1 — restructuring crisis):** 🔴 .env MISSING, scheduler DOWN, session/ gone — Jaime restructuring agent to multi-agent Discord system. 7 new prompt files (boss, media-buyer, discord-agent, client-manager, creative-agent, reporting-agent, tm-agent). New runner features (resumeSessionId, directSystemPrompt, --setting-sources local). Activity log system. Houston status UNKNOWN.

**Key findings preserved from Cycles #46-53:**
- 🔑 Houston detected at $400/day with $0 spend (later raised to $1,500/day) — critical delivery issue or zero-attribution
- 🔑 KYBBA marginal improved from 0.61× to 0.95× (pre-swap, Feb 19→25)
- 🔑 KYBBA adset swap: V9+V1 paused, V5+Asset1 activated (~01:00 UTC Feb 25). First post-swap snapshot Feb 26.
- 🔑 Agent architecture evolved: single owner bot → multi-agent Discord command center (7 specialized agents)
- 🔑 general.txt completed 4th pass with delivery diagnosis workflow
- 🔑 Recurring logging gap pattern (Cycles #49, #51): sessions ending before LEARNINGS.md entry written
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), **#46-53 (#58)**

## 2026-02-25/03-04 — Cycles #54-56 Summary (Discord Prompts Audit + Snapshot Gap Discovery)

> Condensed from 3 detailed entries during Cycle #57 memory maintenance. See git history for originals.

- **Cycle #54 (P2 — Discord prompt audit):** All P1 issues from Cycle #53 resolved (.env restored, scheduler running, session/ exists). Audited all 10 prompt files (7 new Discord + 3 existing). **All cross-consistent**: client aliases, creds, API v21.0, ad account, pixel ID, Supabase patterns. Fixed: reporting-agent.txt missing TM data caveat, tm-agent.txt UUOC. ⚠️ Pixel ID divergence from global project MEMORY.md (agent: 879345548404130, global: 1553637492361321) — needs Jaime clarification. Houston now spending ($242, up from $0) but 0.0× ROAS. KYBBA budget doubled to $100/day.
- **Cycle #55 (P4 — monitoring, Feb 25):** 5 ACTIVE. Houston 🔴 $242 spent, 0 ROAS, 42K impressions, 1,211 clicks — probable pixel/landing page issue (alert already posted). KYBBA marginal worsened to 0.86× (long-term) but 1.65× (recent 2-day, possibly reflecting adset swap). Blended 2.43×, crosses 2.0 ~Mar 6 (conservative). Alofoke 8.53× (exceptional), Camila Ana 3.11× + Sac 4.85× (healthy). **Event snapshots confirmed STATIC** — 72 rows of identical data across 3 dates (TM One source frozen). ROAS trends: Feb 23→24 snapshot deltas useless (Meta reporting lag), Feb 24→25 deltas match expected spend.
- **Cycle #56 (P4 — Mar 4, 7-day gap):** 🔴 **Snapshots stopped after Feb 26** — 6 days missing (Feb 27–Mar 4). Scheduler heartbeats running but Meta sync cron NOT producing data. KYBBA projected to cross 2.0× ~Mar 7 (may already be below). Houston budget escalated to $1,500/day (was $400), spend stuck at $242 in stale data. Alofoke show (Boston Mar 2) is PAST but campaign still ACTIVE. Alerts posted. Jaime actively building TM1 scraper (40+ debug files in session/). MEMORY.md updated with current state.

**Key findings preserved from Cycles #54-56:**
- 🔴 Campaign snapshots stopped after Feb 26 — 6+ days stale. Scheduler heartbeats alive but Meta sync not writing.
- 🔴 Houston $242 spent + 0.0× ROAS with $1,500/day budget — delivery and/or attribution issue. Actual current spend UNKNOWN.
- 🟡 KYBBA marginal 0.86× (long-term) / 1.65× (post-swap short-term). Projected to cross 2.0 ~Mar 7. Show Mar 22.
- 🟡 Alofoke Boston show PAST (Mar 2) — campaign still marked ACTIVE, should be paused.
- 🟡 Event snapshots pipeline writes rows but TM One data source is frozen — zero velocity tracking capability.
- ✅ All 10 Discord prompt files cross-consistent after Cycle #54 audit.
- ⚠️ Pixel ID divergence between agent (879345548404130) and global project MEMORY.md (1553637492361321) — unresolved.
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), **#54-56 (#57)**

## 2026-03-04/05 — Cycles #57-61 Summary (Data Gap Recovery + Major Landscape Change)

> Condensed from 5 detailed entries during Cycle #62 memory maintenance. See git history for originals.

- **Cycle #57 (P3 — memory):** Condensed Cycles #54-56. MEMORY.md verified. 7-day snapshot gap (Feb 27-Mar 4) most critical unresolved issue. Jaime actively building TM1 scraper (40+ session files).
- **Cycle #58 (P4 — monitoring):** Data still stale (Feb 26). Root cause confirmed: Discord restructuring broke Meta sync cron — only heartbeats survived. Last `meta-ads` job was Feb 18 (14 days). Marginal ROAS from Feb 24→26: KYBBA 1.66×, Alofoke 13.24×, Ana 2.69×, Sac 6.39×, Houston 0.0×.
- **Cycle #59 (P6 — infra):** ALL endpoints alive. CLI v2.1.68. .env 23 vars ✅. New `assistant` job from Jaime (19:08 UTC) — interacting with agent via Discord. Meta sync still broken.
- **Cycle #60 (P2 — prompt audit):** **🔴 Alert levels bug found in 3 prompt files** — command.txt, general.txt, media-buyer.txt all used "warning"/"critical" instead of Zod-validated "warn"/"error". Would silently reject all alert POSTs from those modes. Fixed all 3 files + added explicit Zod warning. think.txt: updated P2 rotation list to all 10 files + added missing Supabase tables.
- **Cycle #61 (P4 — major landscape change):** **Snapshots RESUMED** (Mar 5, 10 rows). Campaign count 18→25, ACTIVE 5→10. **7 new campaigns** including 2 new clients (Sienna, Vaz Vil). Houston + Alofoke PAUSED. **KYBBA marginal 4.67×** — crisis averted, adset swap confirmed effective. **San Diego 0.95× with $300/day** — alert posted. Sienna 0× with $200/day flagged. Owner note drafted.

**Key findings preserved from Cycles #57-61:**
- 🔴 Alert levels bug fixed in 3 prompt files (Cycle #60) — was silently blocking all non-think alerts
- 🔴 San Diego 0.95× ROAS at $300/day — actively losing money (Cycle #61)
- 🟢 KYBBA marginal recovered: 0.61× → 1.66× → 4.67× — adset swap definitively worked
- 🟢 Snapshots resumed Mar 5 after 7-day gap. Gap Feb 27-Mar 4 permanent.
- 🟢 Campaign landscape expanded: 25 campaigns (10 ACTIVE), 2 new clients (Sienna, Vaz Vil)
- 🟡 Sienna 0× ROAS, $200/day — possible pixel issue
- Meta sync cron broken since Discord restructuring (~Feb 25), but snapshots resumed via different path
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), **#57-61 (#62)**

## 2026-03-05 — Cycles #63-67 Summary (Monitoring + Prompt Audits + Infra)

> Condensed from 5 detailed entries during Cycle #68 memory maintenance. See git history for originals.

- **Cycle #63 (P4 — monitoring):** 25 campaigns, 10 ACTIVE (unchanged). Marginal ROAS (Feb 26→Mar 5, 7-day gap): KYBBA 4.67× (confirmed recovery), Ana 5.26×, Sac 4.64× — all healthy. Persistent flags: San Diego 0.95×/$300/day, Sienna 0×/$200/day, Phoenix 2.26×/$300/day. SF+Palm Desert 0 purchases. SLC 6.94× (strong). Alert posted.
- **Cycle #64 (P2 — boss.txt + media-buyer.txt):** 6 fixes across 2 files. boss.txt +40 lines: missing Sienna/Vaz Vil aliases, no alerts endpoint, no Supabase column naming, no marginal ROAS methodology, no snapshot query. media-buyer.txt: +2 lines (aliases). All client aliases now consistent across all 10 prompt files.
- **Cycle #65 (P4 — monitoring):** Identical data to #63. Houston→PAUSED (0× ROAS, good call), Alofoke→PAUSED (show past). Marginal ROAS unchanged. Same persistent flags. Alert posted.
- **Cycle #66 (P6 — infra):** ALL GREEN. .env 23 vars ✅, endpoints alive ✅, CLI v2.1.69, heartbeats current, Mar 5 snapshots (10 rows). Old meta-ads cron deprecated (last Feb 18) — snapshots arrive via Discord assistant path. TM1 scraper under heavy development (50 files in session/).
- **Cycle #67 (P2 — tm-agent.txt + creative-agent.txt):** 9 fixes across 2 files. tm-agent +57 lines: client aliases, alerts endpoint, UUOC fix, Supabase section, TM One limitations, session file list. creative-agent +17 lines: client aliases, split creative rules (post/story), error 2490085 pattern. All 10 prompts cross-consistent.

**Key findings preserved from Cycles #63-67:**
- All 10 prompt files now have: client aliases (incl. Sienna/Vaz Vil), alerts endpoint, Supabase column naming
- KYBBA marginal 4.67× confirmed across 3 consecutive monitoring cycles — recovery is real
- Persistent campaign flags: San Diego 0.95×, Sienna 0×, Phoenix 2.26×, SF+Palm Desert 0×
- Infrastructure fully operational, old meta-ads cron deprecated, snapshots flow via Discord assistant
- CLI v2.1.69
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), **#63-67 (#68)**

## 2026-03-04/05 — Cycles #68-76 Summary (Monitoring + Final Prompt Passes + EATA Discovery)

> Condensed from 9 detailed entries during Cycle #77 memory maintenance. See git history for originals.

- **Cycle #68 (P3 — memory):** Condensed #63-67. MEMORY.md verified (CLI v2.1.69). 6 snapshot dates, 65 rows.
- **Cycle #69 (P4 — monitoring):** 25 campaigns, 10 ACTIVE. KYBBA 2.65x (marginal 4.67x, crisis averted). San Diego 0.95x/$300/day still #1 concern. Sienna $235/0x. SF+Palm Desert 0x. Phoenix 2.26x. SLC 6.94x.
- **Cycle #70 (P2 — reporting-agent.txt):** +35 lines: client aliases, Supabase naming, snapshot caveats, alerts, marginal ROAS. 232->267 lines.
- **Cycle #71 (P4 — monitoring):** Same data as #69. Shows imminent: San Jose Mar 6, San Diego Mar 7, Phoenix Mar 8, SLC Mar 9.
- **Cycle #72 (P2 — client-manager.txt):** +50 lines: client aliases, Supabase naming, client overview, alerts, budget caps. 210->260 lines. All 10 prompts now have Sienna/Vaz Vil aliases.
- **Cycle #73 (P3 — memory):** Condensed #68-72. MEMORY.md verified. Pipeline status updated.
- **Cycle #74 (P4 — monitoring):** Phoenix DROPPED below 2.0 (2.26x->1.88x, $300/day, show Mar 8). San Diego 1.13x/$300/day (show Mar 7). $800/day combined on SD+Phoenix+Sienna with ~0.6x weighted ROAS. SF recovered (0x->3.45x). Marginal ROAS: KYBBA 4.67x, Ana 5.26x, Sac 4.64x — all stable. Alert posted.
- **Cycle #75 (P2 — don-omar-agent.txt):** discord-agent.txt replaced by don-omar-agent.txt (EATA/Vivaticket specialist). +25 lines: event IDs, report fields, token lifetime, API params, corrected session file list. MEMORY.md updated (discord-agent -> don-omar-agent).
- **Cycle #76 (P4 — monitoring + EATA):** **EATA pipeline LIVE!** Don Omar BCN: 30,052 tickets sold, 3.2M euros gross, 442 tickets/day, avg price 107.55 euros. Event Jul 23 2026. San Jose show Mar 6 has no Meta campaign (may be intentional). tm_events column naming documented.

**Key findings preserved from Cycles #68-76:**
- All 10 prompt files completed latest round of updates (reporting-agent #70, client-manager #72, don-omar-agent #75)
- KYBBA marginal 4.67x confirmed stable across 5+ monitoring cycles — recovery is definitive
- Phoenix dropped below 2.0 (new flag, show Mar 8). SD 1.13x persistent. Sienna 0x persistent.
- EATA/Vivaticket pipeline fully operational — Don Omar BCN event data flowing to Supabase
- discord-agent.txt replaced by don-omar-agent.txt
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), **#68-76 (#77)**

## 2026-03-05 — Cycles #77-81 Summary (Monitoring + Prompt + Infra + Memory)

> Condensed from 5 detailed entries during Cycle #82 memory maintenance. See git history for originals.

- **Cycle #77 (P3 — memory):** Condensed #68-76. MEMORY.md verified. LEARNINGS.md 392→320 lines.
- **Cycle #78 (P4 — monitoring):** **San Diego → PAUSED** (was 0.95x, good call by Jaime). Now 9 ACTIVE. Marginal ROAS (Feb 26→Mar 5): KYBBA 4.65x, Sac 4.64x, Ana 5.26x — all healthy. SLC surged to 20.2x (scaling opportunity). SF recovered (0x→3.45x). Persistent flags: Phoenix 1.88x/$300/day (show Mar 8), Sienna $496/0x/$200/day, Palm Desert 0.39x/$50/day. EATA Don Omar BCN: 30,052 tickets, 3.2M EUR.
- **Cycle #79 (P6 — infra):** ALL GREEN. .env 25 vars, endpoints alive, CLI v2.1.69, scheduler heartbeats current. EATA token possibly stale (9h old, 1-2h lifetime) — cookie refresh cron may not log to agent_jobs. Snapshots healthy (65 rows, 6 dates). No meta-ads jobs since Feb 18 (deprecated, snapshots via Discord assistant).
- **Cycle #80 (P2 — command.txt 5th pass):** 5 fixes: (1) missing Sienna/Vaz Vil/Don Omar slug mappings (real bug), (2) multiple pixel IDs for adset creation, (3) ad creative creation section with split post/story, (4) EATA/Vivaticket reference, (5) MEMORY.md Vaz Vil slug set to "vaz_vil" + Sienna pixel added.
- **Cycle #81 (P4 — monitoring):** 9 ACTIVE unchanged. KYBBA marginal 4.66x (stable 7+ cycles — recovery definitive). Phoenix intraday marginal 1.10x ($265 spend, $292 revenue in 12h). EATA Don Omar BCN: +53 tickets in 1.5h window (active sales). New tm_events columns discovered: `tickets_sold_today`, `revenue_today`, `avg_ticket_price`.

**Key findings preserved from Cycles #77-81:**
- San Diego PAUSED by Jaime (0.95x/$300/day, show Mar 7) — correct call
- KYBBA marginal 4.66x stable across 7+ monitoring cycles — recovery definitively confirmed
- Phoenix intraday marginal 1.10x — barely breakeven, show Mar 8, $300/day
- Sienna 0x after 7+ days and $496 — persistent zero-conversion issue
- SLC 20.2x — exceptional performer, scaling opportunity
- EATA pipeline live with active sales velocity (442 tickets/day, +53 in 1.5h sample)
- command.txt 5th pass: slug mappings, pixel IDs, creative creation, EATA reference
- Infrastructure all green, EATA token staleness noted (non-critical)
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), **#77-81 (#82)**

## 2026-03-05 — Cycles #82-89 Summary

> Condensed from 8 detailed entries during Cycle #90 memory maintenance. See git history for originals.

- **Cycle #82 (P3 — memory):** Condensed #77-81. MEMORY.md updated (San Diego RESOLVED, campaign counts).
- **Cycle #83 (P4 — monitoring):** 9 ACTIVE, 25 total. Marginal ROAS (Feb 26→Mar 5): KYBBA 4.67x, Sac 4.64x, Ana 5.26x — all healthy. Persistent flags: Phoenix 1.88x/$300/day (show Mar 8), Sienna $496/0x/$200/day (8+ days), Palm Desert 0.39x/$50/day, Vaz Vil $53/0x (2 days old). SLC 20.2x exceptional. Alert posted.
- **Cycle #84 (P2 — general.txt 5th pass):** +18 lines: added Sienna/Vaz Vil/Don Omar aliases, Sienna pixel ID, EATA/Vivaticket query section. 445→463 lines.
- **Cycle #85 (P5 — proposals):** Recreated session/proposals.md. 8 ranked proposals A-H. Zero-Conversion Auto-Detector is new #1.
- **Cycle #86 (P6 — infra):** ALL GREEN. .env 25 vars, endpoints alive, CLI v2.1.69, scheduler current, EATA auth fresh.
- **Cycle #87 (P4 — monitoring):** Identical to #83. No new snapshots. All flags persistent.
- **Cycle #88 (P4 — monitoring):** Mar 6 snapshot appeared (26 rows — biggest yet). Phoenix worsening: 2.26→1.88x blended, marginal 1.11x, show Mar 8. Sienna budget halved $200→$100/day. SLC exceptional 20.20x. SF recovered 0→3.45x. EATA Don Omar healthy (30K tix, 3.2M EUR). Alert posted.
- **Cycle #89 (P2 — boss.txt audit):** 5 fixes, +20 lines (318→338). Added Don Omar alias, don-omar-agent to team table, EATA/Vivaticket Supabase queries, tm_events column naming, event_snapshots + demographics table refs.

**Key findings preserved from Cycles #82-89:**
- All 12 prompts now have Sienna/Vaz Vil/Don Omar aliases + EATA coverage (general.txt #84, boss.txt #89, meeting-agent.txt #109)
- Proposals: A (Zero-Conversion Detector) > B (Show Proximity Gate) > C (Budget Cap) > D (Campaign-Event Link) > E (Marginal Dashboard) > F (Ad Health) > G (Change Journal) > H (EATA Velocity)
- KYBBA marginal 4.67x stable 9+ cycles — definitively recovered
- Persistent campaign flags: Phoenix 1.88x (show Mar 8), Sienna 0x, Palm Desert 0.39x
- Infrastructure all green, `source .env` bash workaround documented
- Mar 6 snapshot = 26 rows (all campaigns), confirming snapshot pipeline healthy
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), **#82-89 (#90)**

## 2026-03-05 — Cycles #90-95 Summary (Full Day: Monitoring + Prompts + Infra + Memory)

> Condensed from 6 individual entries during Cycle #96 memory maintenance.

- **Cycle #90 (P3 — Memory):** Condensed #88-89 into block. Updated MEMORY.md: 26 campaigns (added Camila San Antonio PAUSED). Verified 9 ACTIVE, 17 PAUSED.
- **Cycle #91 (P4 — Monitoring):** First analysis with Mar 6 snapshots. 8-day marginals: KYBBA 5.12x (up from 4.67x), Camila Anaheim 4.70x, Camila Sac 4.79x. Consecutive-day: SLC 30.12x (star), SF 5.99x (recovered), Phoenix 1.11x (barely breakeven, $300/day, show Mar 8), Palm Desert 0.69x (losing), Sienna/Vaz Vil 0x. EATA Don Omar BCN: 30,052 tickets, 3.2M EUR.
- **Cycle #92 (P2 — email-agent.txt):** First-ever audit. +22 lines (100->113). Added: "Load memory first" rule, "Read full thread" rule, financial/legal safety guardrail, attachments limitation, error handling section, VIP domain expansion (cvfirebirds, cajinapro, shrss), cron digest clarification.
- **Cycle #93 (P2 — reporting-agent.txt):** +44 lines (268->312). Added: Don Omar client aliases, event_snapshots queries, demographics queries, full EATA data source section, EATA report template, currency awareness rule, standalone Don Omar BCN reporting note.
- **Cycle #94 (P6 — Infra):** All healthy. Endpoints alive (ingest 400, alerts 401). Heartbeats every minute. last-events.json slightly stale (32h). TM session files cleaned up.
- **Cycle #95 (P4 — Monitoring):** Multi-day marginals (Feb 23->Mar 6): KYBBA 4.21x, Camila Sac 5.10x, Camila Anaheim 4.30x — all healthy. Status changes: San Diego + Alofoke -> PAUSED (informational). Persistent flags unchanged: Phoenix 1.88x, Sienna 0x, Palm Desert 0.39x, Vaz Vil 0x (early).

**Key findings across #90-95:**
- KYBBA recovery definitive: marginal 4.21-5.12x depending on window
- SLC 20.20x blended / 30x marginal — best performer by far
- Phoenix approaching show (Mar 8) at 1.88x / 1.11x marginal — flagged since Cycle #74, Jaime aware
- Sienna 0x after $496 / 8+ days — persistent zero-conversion issue
- Prompt audit coverage: email-agent.txt (first-ever), reporting-agent.txt (last was Cycle #70)
- Remaining unaudited by think loop: don-omar-agent.txt

## 2026-03-06 — Cycles #96-101 Summary (Full Day: Prompts + Monitoring + Memory + Proposals + Infra)

> Condensed from 7 individual entries during Cycle #102 memory maintenance.

- **Cycle #96 (P2 — client-manager.txt):** +19 lines (261->280). Added Don Omar BCN aliases/section, fixed Sienna description (ViewContent=expected 0x), updated Sienna budget $200->$100/day, added EATA query pattern.
- **Cycle #97 (P4 — monitoring):** 9 ACTIVE, no status changes. Marginals (Mar 5->6, consecutive-day): SLC 30.12x, Sac 5.96x, SF 5.99x, Phoenix 1.11x (snapshot) but live 2.67x (recovered via late attribution). Anaheim 0.71x flagged — needs multi-day confirmation. Palm Desert 0.69x persistent. EATA Don Omar BCN: 30,052 tickets.
- **Cycle #98 (P3 — memory):** MEMORY.md refreshed: Phoenix 1.88->2.67x, SLC 20.25->28.16x, SF 3.45->7.76x, Palm Desert 0.39->0.31x, Vaz Vil $53->$101. All 9 ACTIVE campaigns updated.
- **Cycle #99 (P2 — don-omar-agent.txt):** First-ever audit. +49 lines (171->220). Added Key Facts, event_snapshots/demographics query patterns, velocity analysis section, safety guardrails, EUR emphasis. **All 11 prompt files now audited by think loop.**
- **Cycle #100 (P4 — monitoring):** Same 9 ACTIVE. Key resolution: Anaheim multi-day marginal (Feb 26->Mar 6) = 4.70x — confirms 0.71x consecutive-day was noise. No new anomalies.
- **Cycle #101a (P5 — proposals):** Full rewrite of proposals.md. Added Proposal C (Post-Show Auto-Pause) + J (Snapshot Gap Backfill). 10 total (was 8). Added implementation priority order.
- **Cycle #101b (P6 — infra):** All green. Endpoints alive, heartbeat current, CLI found. last-events.json 2 days stale (TM sync not running daily). EATA auth expired but refresh cron handles it.

**Key findings preserved from Cycles #96-101:**
- All 12 prompts audited — full coverage achieved (meeting-agent.txt was last, Cycle #109)
- Anaheim marginal scare resolved: 4.70x multi-day vs 0.71x consecutive-day noise
- Phoenix recovered to 2.67x live (1.88x snapshot lag). Show Mar 8.
- 10 proposals now (A-J), with implementation priority order
- Persistent flags unchanged: Palm Desert 0.31x, Sienna 0x (expected), Vaz Vil 0x (early)
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), #82-89 (#90), #90-95 (#96 block), **#96-101 (#102)**

## 2026-03-06 — Cycles #102-105 Summary (Memory + Monitoring + Prompt + Monitoring)

> Condensed from 4 detailed entries during Cycle #106 memory maintenance. See git history for originals.

- **Cycle #102 (P3 — memory):** Condensed #96-101. Updated MEMORY.md proposals (8→10, A-J). Fixed proposals.md reference.
- **Cycle #103 (P4 — monitoring):** 9 ACTIVE unchanged. Marginals (Mar 5→6, consecutive-day): SLC 30.12x, Sac 5.96x, Phoenix 1.11x (snapshot 1.88x, live 2.67x — attribution lag). Anaheim 0.71x confirmed noise (multi-day 4.70x). KYBBA spend adjusted down slightly. No new anomalies.
- **Cycle #104 (P2 — command.txt 2nd pass):** 3 fixes, +20 lines (817→837). (1) Campaign Creation Rules missing (CTA=Shop Now, artist page, Advantage+ OFF, EU beneficiary) — critical gap fixed. (2) `purchases` added to ingest mapping. (3) `frequency` added to ingest + session cache format.
- **Cycle #105 (P4 — monitoring):** Same data as #103. Column naming discovery: Supabase `daily_budget` (not `daily_budget_cents`), `lifetime_budget` = 0 (not null). EATA unchanged (30,052 tix).

**Key findings preserved from Cycles #102-105:**
- command.txt Campaign Creation Rules gap fixed (was in MEMORY.md but not in the prompt the agent reads)
- Column naming: Supabase `daily_budget` vs session cache `daily_budget_cents`; `lifetime_budget` = 0 not null
- 9 ACTIVE campaigns stable across all 4 cycles, no status changes
- Persistent flags unchanged: Phoenix 2.67x live (show Mar 8), Palm Desert 0.31x, Sienna 0x (expected), Vaz Vil 0x (early)
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), #82-89 (#90), #90-95 (#96 block), #96-101 (#102), **#102-105 (#106)**

## 2026-03-06 — Cycles #106-109 Summary (Memory + Infra + Monitoring + Prompt)

> Condensed from 4 detailed entries during Cycle #110 memory maintenance. See git history for originals.

- **Cycle #106 (P3 — memory):** Condensed #102-105. Updated MEMORY.md: added `lifetime_budget = 0 (not null)` note.
- **Cycle #107 (P6 — infra):** ALL GREEN. .env 38 vars, endpoints alive (ingest 400, alerts 401 — no Clerk regression), heartbeat current, CLI v2.1.69. last-events.json 2 days stale (persistent since Cycle #94).
- **Cycle #108 (P4 — monitoring):** 9 ACTIVE, no status changes. KYBBA negative spend delta (Meta reporting correction). Phoenix 2.67x blended but 1.11x marginal, show Mar 8, $300/day — Jaime aware since Cycle #74. SLC 28.11x exceptional. SF 7.76x recovered. Palm Desert 0.31x persistent. Sienna/Vaz Vil 0x (expected/early). No new anomalies.
- **Cycle #109 (P2 — meeting-agent.txt):** First-ever audit. +26 lines (90→116). Added: service account details, --send-updates options, --query/today docs, error handling section, cross-timezone section, context isolation rule.

**Key findings preserved from Cycles #106-109:**
- All 12 prompt files now audited by think loop (meeting-agent.txt was last)
- Infrastructure all green, last-events.json staleness persistent (TM sync not daily)
- 9 ACTIVE campaigns stable, no status changes
- Persistent flags: Phoenix 1.11x marginal (show Mar 8), Palm Desert 0.31x, Sienna 0x (expected), Vaz Vil 0x (early)
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), #82-89 (#90), #90-95 (#96 block), #96-101 (#102), #102-105 (#106), **#106-109 (#110)**

## 2026-03-06/08 — Cycles #110-121 Summary (Monitoring + Prompts + Memory + Infra)

> Condensed from 13 detailed entries during Cycle #122 memory maintenance. Note: cycle numbering was confused in this range (#112 and #113 each had duplicate entries with different priorities). See git history for originals.

- **Cycle #110 (P3 — memory):** Condensed #106-109. Updated MEMORY.md (campaign counts, Don Omar BCN Meta campaign launched).
- **Cycle #111 (P4 — monitoring):** 10 ACTIVE (was 9). Don Omar BCN NEW ($100/day, $0 spend). Phoenix budget $300->$500/day (show Mar 8). Sienna budget $100->$200/day. KYBBA spend corrected DOWN by Meta (blended 2.68->2.47x). Anaheim 3 consecutive blended ROAS declines (4.40->4.11->3.95).
- **Cycle #112a (P3 — memory):** MEMORY.md refreshed: Don Omar BCN added, Phoenix/Sienna budgets updated, Known Issues reorganized, shows updated.
- **Cycle #112b (P2 — media-buyer.txt):** 3 fixes: Don Omar BCN aliases, Sienna/Vaz Vil slug mappings, campaign count corrected.
- **Cycle #113a (P4 — monitoring):** 10 ACTIVE. Marginal ROAS (Mar 5->7): SLC 36.18x, SF 11.71x, Sac 7.12x, Phoenix 3.09x (recovered), KYBBA 2.85x. Anaheim 1.28x marginal (declining). Palm Desert 0.47x. KYBBA blended dipped 2.68->2.47.
- **Cycle #113b (P6 — infra):** ALL GREEN. .env OK, endpoints alive, heartbeat current, CLI found, snapshots healthy.
- **Cycle #114 (P6 — infra):** ALL GREEN. Heartbeat 03:30 UTC, alerts 401 (no Clerk regression), snapshots Mar 7 present.
- **Cycle #115 (P4 — monitoring):** Same 10 ACTIVE. Marginal (Mar 5->7, 2-day): SLC 42.46x, SF 24.71x, Sac 8.24x, Phoenix 3.09x. Anaheim declining (blended 3.95x, marginal 1.28x). KYBBA spend decreased (Meta revision). Palm Desert 0.47x persistent.
- **Cycle #116 (P2 — general.txt):** 3 fixes: Don Omar BCN alias updated (now has Meta campaign), EATA section updated, "san antonio" alias added.
- **Cycle #117 (P4 — monitoring):** Data 38h stale. Phoenix 2.67x (show Mar 8 today). KYBBA 2.47x (near threshold, show Mar 22). Anaheim 3.95x (3 consecutive declines). Phoenix marginal 5.02x (strong final push).
- **Cycle #118 (P3 — memory):** Major MEMORY.md update: PAUSED campaign data was severely outdated. Dallas actually $625/19.02x (was "$0.30"), Houston $2,977/5.90x (was "$243/0x"), San Antonio $1,718/3.89x. Known Issues reorganized. Shows updated.
- **Cycle #119 (P6 — infra):** ALL GREEN. Heartbeat 06:00 UTC, Gmail watch expires Mar 14, snapshots healthy.
- **Cycle #120 (P2 — media-buyer.txt):** 4 fixes: Campaign Creation Rules section added (CTA, artist page, Advantage+ OFF, EU beneficiary), pixel selection parameterized, account total corrected.
- **Cycle #121 (P4 — monitoring):** Same 10 ACTIVE. KYBBA trajectory 2.47->2.43->2.65->2.68->2.47 (not 3 consecutive declines but volatile). Anaheim 4th data point declining (3.95x). SLC 42.5x marginal (explosive). Phoenix 5.02x marginal (strong final push for Mar 8 show). Palm Desert ~0x marginal (dead weight).

**Key findings preserved from Cycles #110-121:**
- KYBBA blended volatile around 2.47x — not in freefall but close to 2.0 threshold. Show Mar 22.
- Anaheim had 3 consecutive blended ROAS declines (4.40->4.11->3.95) but marginal improved short-term (1.87x).
- Phoenix recovered to 2.67x blended / 5.02x marginal with $500/day for Mar 8 show.
- PAUSED campaign data corrected: Dallas/Houston/San Antonio all ran significant spend after reactivation.
- media-buyer.txt got Campaign Creation Rules + pixel parameterization (Cycle #120) — critical gap fixed.
- general.txt updated for Don Omar BCN Meta campaign (Cycle #116).
- Infrastructure consistently green across 3 infra checks (#113b, #114, #119).
- Cycle numbering confused (#112 and #113 duplicated) — resolved by appending a/b suffixes in this summary.
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), #82-89 (#90), #90-95 (#96 block), #96-101 (#102), #102-105 (#106), #106-109 (#110), **#110-121 (#122)**

## 2026-03-07/08 — Cycles #122-129 Summary (Monitoring + Prompts + Infra + Proposals + Memory)

> Condensed from 8 detailed entries during Cycle #130 memory maintenance. See git history for originals.

- **Cycle #122 (P3 — memory):** Condensed #110-121. MEMORY.md verified, no updates needed.
- **Cycle #123 (P4 — monitoring):** 10 ACTIVE. Palm Desert RECOVERED (0.31→2.11x, late attribution). SLC budget bumped to $800/day (34.27x ROAS). Don Omar BCN strong start (6.53x, 4 purchases, $224). Anaheim marginal 0.13x (alarming but blended 3.95x healthy). KYBBA 2.47x volatile near threshold.
- **Cycle #124 (P2 — boss.txt):** +45 lines (438→483). Added: client manager channel routing note, agent system health queries, show proximity rules, pixel selection section.
- **Cycle #125 (P4 — monitoring):** Phoenix show Mar 8 imminent ($500/day, 2.55x). Anaheim marginal IMPROVED 0.13→1.25x. Palm Desert attribution lag documented. Mar 5→7 marginals: SLC 36.17x, SF 11.72x, Sac 7.12x, Phoenix 3.09x.
- **Cycle #126 (P6 — infra):** ALL GREEN. Endpoints alive, heartbeat current, Gmail watch expires Mar 14, CLI found.
- **Cycle #127 (P5 — proposals):** +2 proposals: K (Daily Morning Digest) and L (Multi-Client Portfolio P&L). All existing proposals refreshed. 12 total (A-L). Priority: A→K→G→D→...
- **Cycle #128 (P4 — monitoring):** **🔑 Attribution lag recovery confirmed across 3 campaigns**: Anaheim 0.13→5.95x, Palm Desert 0.47→12.88x, Sacramento 0.71→4.57x. SLC explosive 51.66x marginal. Phoenix 2.20x (show Mar 8, should pause soon). KYBBA spend delta too small for marginal.
- **Cycle #129 (P2 — media-buyer.txt):** +56 lines (684→740). Added: `actions` array parsing example, `cost_per_action_type` field, multi-snapshot marginal ROAS query, show proximity rules.

**Media Buyer Mistakes Log (from Jaime feedback, Mar 8):**
1. Wrong day count: said SLC "2 days out" when actually 1 day. **Rule: days_to_show = show_date - today.**
2. Didn't send scheme to #boss channel. **Rule: ALWAYS deliver plans to the requesting channel immediately.**

**Key findings preserved from Cycles #122-129:**
- 🔑 Attribution lag recovery confirmed: 2-day snapshot marginals can be extremely misleading for smaller-budget campaigns. Anaheim/Palm Desert/Sacramento all showed <1.0x marginal that fully reversed to 5-13x once conversions attributed.
- 🔑 SLC exceptional: 34→51x marginal, $800/day budget justified.
- 🔑 Don Omar BCN Meta campaign delivering (6.53x, 4 purchases from $224).
- 🔑 Phoenix show Mar 8 — final push at $500/day, 2.55x blended.
- boss.txt got show proximity rules + agent health queries (Cycle #124).
- media-buyer.txt got actions parsing + marginal ROAS queries + show proximity rules (Cycle #129).
- Proposals expanded to 12 (K: Daily Digest, L: Portfolio P&L).
- Infrastructure all green (Cycle #126).
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), #82-89 (#90), #90-95 (#96 block), #96-101 (#102), #102-105 (#106), #106-109 (#110), #110-121 (#122), **#122-129 (#130)**

## 2026-03-07/08 — Cycles #130-136 Summary (Monitoring + Prompts + Infra + Memory)

> Condensed from 7 detailed entries during Cycle #137 memory maintenance. See git history for originals.

- **Cycle #130 (P3 — memory):** Condensed #122-129. MEMORY.md proposals refreshed (10→12, K+L added).
- **Cycle #131 (P4 — monitoring):** 10 ACTIVE. **🚩 Sienna: $776/0x after 9 days** — alert posted. **⚠️ Phoenix: show Mar 8, still ACTIVE at $500/day** — alert posted. Vaz Vil $140/0x (4 days, monitoring). SLC 51.66x marginal (explosive). Palm Desert attribution lag pattern 0→0.39→0.31→2.11x.
- **Cycle #132 (P2 — tm-agent.txt):** +34 lines (376→410). Added Don Omar BCN alias, EATA/Vivaticket section, service account MFA note, event_snapshots live vs static clarification.
- **Cycle #133 (P4 — monitoring):** 10 ACTIVE unchanged. Persistent flags: Sienna 0x, Phoenix post-show, Vaz Vil approaching threshold. KYBBA only $5.65 daily delta (unreliable).
- **Cycle #134 (P6 — infra):** ALL GREEN. Health endpoint now 200 ✅ (was 404). Ingest 400 ✅, Alerts 401 ✅, Production Railway all green. agent_jobs deprecated in favor of agent_runtime_state + agent_tasks.
- **Cycle #135 (P2 — creative-agent.txt):** +43 lines (232→275). 6 fixes: Don Omar alias, CTA→"Shop Now" (was wrong), Advantage+ OFF section, artist pages, video upload gotcha, campaign-specific evaluation rules (Sienna ViewContent).
- **Cycle #136 (P4 — monitoring):** **🚩 Vaz Vil alert posted** — $140/0x, 4 consecutive snapshots all 0x. Healthy: SLC 34.27x, SF 8.55x, Don Omar 6.53x, Sac 5.02x, Ana 4.09x, Palm Desert 2.11x, KYBBA 2.47x.

**Key findings preserved from Cycles #130-136:**
- 🚩 Sienna $776/0x after 10+ days — alerted Cycle #131. Expected (ViewContent, not purchases).
- 🚩 Vaz Vil $140/0x after 5 days — alerted Cycle #136. 4 consecutive 0x snapshots.
- ⚠️ Phoenix post-show (Mar 8) still ACTIVE at $500/day — alerted Cycle #131.
- ✅ Health endpoint now returns 200 (improvement, Cycle #134).
- ✅ creative-agent.txt CTA fixed: "Shop Now" always (was "GET_TICKETS" — wrong).
- ✅ tm-agent.txt got full EATA/Vivaticket context (Cycle #132).
- KYBBA 2.47x stable but daily spend delta too small for marginal analysis.
- Infrastructure all green. agent_jobs table deprecated.
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), #82-89 (#90), #90-95 (#96 block), #96-101 (#102), #102-105 (#106), #106-109 (#110), #110-121 (#122), #122-129 (#130), **#130-136 (#137)**

## 2026-03-08 — Cycles #138-152 Summary (Full Day: Prompts + Monitoring + Memory + Infra)

> Condensed from 15 detailed entries during Cycle #153 memory maintenance. See git history for originals.

- **Cycle #138 (P2 — reporting-agent.txt):** 3 fixes: Don Omar BCN "no Meta campaigns" → WRONG (has $600/day campaign), added `actions` array parsing for purchase/CPA extraction, expanded EATA report template with Meta Ads USD section.
- **Cycle #139 (P4 — monitoring):** 10 ACTIVE. Marginals healthy (SLC 47x, SF 19.75x, Sac 6.43x). Palm Desert attribution lag confirmed (0.31→2.11x blended, 5.79x marginal). KYBBA delivery issue persists ($2-6/day on $100/day budget). All flags previously raised.
- **Cycle #140 (P3 — memory):** 3 MEMORY.md fixes: SLC show date corrected (was listed as PAST, actually tomorrow), proposals count 10→12, spend/ROAS values verified current.
- **Cycle #141 (P2 — client-manager.txt):** 4 fixes: Don Omar BCN Meta campaign added ($600/day, 6.53x), Sienna budget corrected ($100→$200/day), Vaz Vil updated ($50/day, $197 spent, 0x), flagged Don Omar budget stale in MEMORY.md.
- **Cycle #142 (P4 — monitoring):** **Sienna: ACTIVE → PAUSED** — Jaime paused after repeated 0x alerts. 9 ACTIVE now. Palm Desert attribution confirmed (12.87x marginal). Don Omar first meaningful snapshot ($224, 6.53x).
- **Cycle #143 (P2 — email-agent.txt):** 3 fixes: added mark-read command to tool docs, added meeting/calendar handoff protocol, fixed pixel mislabel in email-agent memory (Don Omar Spain → San Diego Pechanga Arena).
- **Cycle #144 (P6 — infra):** ALL GREEN. Health 200, Ingest 400, Alerts 401, heartbeat <1 min old, snapshots current, Claude CLI OK, EATA scripts present.
- **Cycle #145 (P2 — meeting-agent.txt):** 3 fixes: added --end/--calendar/--no-meet flags, --end vs --duration clarification, email-agent handoff reception protocol. **All 11 original prompts fully audited.** Noted prompts/ now has 18 files (was 12).
- **Cycle #146 (P4 — monitoring):** 9 ACTIVE stable. SLC 51.66x marginal 🚀. Phoenix show today, still ACTIVE. Palm Desert blended trajectory: 0x→0.39→0.31→2.11→3.35x (fully recovered). Don Omar $600/day, 6.73x.
- **Cycle #147 (P3 — memory):** 10 MEMORY.md fixes: prompt count 12→18, Don Omar budget $100→$600/day, Sienna ACTIVE→PAUSED, campaign counts 10/17→9/18, SLC/Palm Desert/Phoenix/Anaheim/Sac/Vaz Vil spend+ROAS updates, session cache freshness.
- **Cycle #149 (P2 — content-finder.txt):** First new-prompt audit. 2 fixes: context isolation strengthening, memory-first enforcement. Growth ledger script verified.
- **Cycle #148,150,152 (P4 — monitoring ×3):** Repeated monitoring — 9 ACTIVE stable, no status changes. Phoenix still ACTIVE (show today), SLC exceptional final push (51.6x marginal). KYBBA delivery broken ($5.65/day on $100/day, 6-8th cycle noting). Vaz Vil 7-8th consecutive 0x. All flags previously raised, no new alerts.
- **Cycle #151 (P2 — customer-whatsapp-agent.txt):** 2 fixes: context isolation warning, memory-first enforcement. Routing targets and JSON formats verified.

**Key outcomes preserved from Cycles #138-152:**
- ✅ All 11 original prompts completed full audit cycle (Cycle #145). New prompt rotation started: content-finder.txt (#149), customer-whatsapp-agent.txt (#151) done. 4 remaining: growth-supervisor.txt, lead-qualifier.txt, publisher-tiktok.txt, tiktok-supervisor.txt.
- ✅ Sienna ACTIVE → PAUSED (Cycle #142) — Jaime paused after 0x alerts. Expected outcome.
- ✅ MEMORY.md major update (Cycle #147) — 10 fixes including Don Omar $600/day, counts, spend/ROAS.
- ✅ Infrastructure all green (Cycle #144).
- ⚠️ Phoenix show Mar 8 — still ACTIVE at $500/day. Should be paused post-show.
- ⚠️ SLC show Mar 9 — $800/day, 51.6x marginal. Exceptional. Should be paused post-show.
- ⚠️ KYBBA delivery broken — $5.65/day on $100/day. Meta won't spend. Not a ROAS issue (2.47x blended). Noted 8 cycles, not alerted (not a money-losing problem).
- ⚠️ Vaz Vil 8+ consecutive 0x snapshots, $197 total. Alerted Cycle #136.
- ✅ Don Omar BCN strong start: $224, 6.53x ROAS, $600/day budget.
- Palm Desert attribution lag pattern fully confirmed: 0x→0.39→0.31→2.11→3.35x blended, 12.87x marginal.
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), #82-89 (#90), #90-95 (#96 block), #96-101 (#102), #102-105 (#106), #106-109 (#110), #110-121 (#122), #122-129 (#130), #130-136 (#137), **#138-152 (#153)**

## 2026-03-08/09 — Cycles #153-163 Summary (Prompt Audit Completion + Post-Show Monitoring + Infra)

> Condensed from 11 individual entries during Cycle #164 memory maintenance.

- **Prompt audits (P2: #154, #159, #161, #163):** Completed final 4 of 6 new prompts: growth-supervisor.txt (#154), lead-qualifier.txt (#159), publisher-tiktok.txt (#161), tiktok-supervisor.txt (#163). All received same 3-fix pattern: context isolation warning, memory-first enforcement, Business Context section. lead-qualifier also got explicit Score Ranges (0-100). don-omar-agent added to delegation targets in growth-supervisor, publisher-tiktok, tiktok-supervisor. **🎉 All 17 prompt files now audited by think loop** (original 11 by Cycle #145, 6 new by Cycle #163).
- **Memory maintenance (P3: #153, #156, #157):** Cycle #153 condensed Cycles #138-152. Cycle #156 did major MEMORY.md update (29 campaigns, show dates, Known Issues) but failed to log itself — reconstructed in #157. Cycle #157 promoted heartbeat staleness to Known Issue #1, updated show dates (Phoenix→PAST, SLC→TODAY).
- **Monitoring (P4: #155, #158, #162):** Campaign landscape evolved: 29 total (11 new staged), 8→6 ACTIVE (Phoenix+SLC paused post-show, Don Omar BCN paused by Jaime). Phoenix final $1,771, SLC final $1,131 (34.27× ROAS — extraordinary). Marginal ROAS healthy across Arjona/Camila campaigns (SF 8-10×, Palm Desert 4.7×, Anaheim 4-6×, Sacramento 3-4×). **Data pipeline gap discovered**: ingest doesn't update Supabase status when campaigns paused externally on Meta. Camila Anaheim Mar 8 snapshot anomaly (spend=0 while other dates show $2977).
- **Infrastructure (P6: #160):** INGEST_URL = localhost:3002 (alerts silently dropped when dev server down — architectural, not bug). Heartbeat stale 25h+ but scheduler partially running (snapshots + gmail_watch updating). TM sync stale 5 days. All .env vars present. Claude CLI OK.

**Persistent flags (as of Cycle #163):**
- ⚠️ Vaz Vil: 7+ days, $243, 0× ROAS — alerted Cycle #136
- ⚠️ KYBBA delivery: ~$2/day on $100/day budget — 11 cycles noting, not money-losing (2.72× blended)
- ⚠️ Heartbeat stale since Mar 8 — scheduler partially functional (syncs run, heartbeat cron broken)
- ⚠️ Supabase status stale for paused campaigns — ingest doesn't sync PAUSED status back (code fix needed)

## 2026-03-09 — Cycles #164-167 Summary (Memory + Monitoring + Prompt + Monitoring)

> Condensed from 4 detailed entries during Cycle #168 memory maintenance. See git history for originals.

- **Cycle #164 (P3 — memory):** Condensed #153-163. LEARNINGS.md 695→~570 lines.
- **Cycle #165 (P4 — monitoring):** Session cache expanded 29→299 campaigns (all historical now included). 8→6 ACTIVE: Phoenix+SLC PAUSED post-show (expected). Marginals (Mar 7→10, 3-day): Anaheim 4.81x, Sac 3.67x, Palm Desert 4.70x, SF 9.88x — all healthy. Palm Desert budget 10x'd ($50→$500/day), spend $240→$542. KYBBA delivery still broken ($2.67/day on $100/day, 12+ cycles). Vaz Vil 0x persistent (9+ snapshots).
- **Cycle #166 (P2 — command.txt):** 4 fixes: campaign count ~97→~300, Supabase snapshot spend=CENTS note, Advantage+ `degrees_of_freedom_spec` API syntax, snapshot query CENTS reminder.
- **Cycle #167 (P4 — monitoring):** 6 ACTIVE stable. Marginals (Mar 8→10, 2-day): Anaheim 4.19x, Sac 3.20x, Palm Desert 3.45x, SF 8.07x — all healthy. Sacramento marginal dipped below blended (3.20 vs 4.82) but still well above 2.0.

**Key findings preserved from Cycles #164-167:**
- Campaign cache now ~300 (all historical included in sync since Mar 9)
- Palm Desert budget 10x'd to $500/day, marginal 3.45-4.70x confirms profitable scaling
- Sacramento marginal dipped to 3.20x — worth watching but healthy
- All 6 ACTIVE campaigns profitable on incremental spend
- Persistent flags: Vaz Vil 0x ($244, 10+ snapshots), KYBBA delivery broken (~$2/day on $100/day)
- command.txt got Advantage+ API syntax (was missing — agent couldn't enforce the rule programmatically)
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), #54-56 (#57), #57-61 (#62), #63-67 (#68), #68-76 (#77), #77-81 (#82), #82-89 (#90), #90-95 (#96 block), #96-101 (#102), #102-105 (#106), #106-109 (#110), #110-121 (#122), #122-129 (#130), #130-136 (#137), #138-152 (#153), #153-163 (#164), **#164-167 (#168)**
