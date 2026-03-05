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
- Customer asked about scaling to $50/adset (from $50 total campaign). No additional budget available — $50/day is the cap.

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

## 2026-02-23/24 — Cycles #35-38 Summary + Manual Sessions

> Condensed from 4 think cycles + 2 manual sessions during Cycle #39 memory maintenance. See git history for originals.

- **Cycle #35 (P3 — memory maintenance):** Condensed Cycles #30-34. Found KYBBA budget discrepancy ($100 vs $50) — flagged for verification. Proposals count corrected to 8.
- **Cycle #36 (P4 — first Feb 24 data):** **✅ Feb 24 snapshots arrived** (3rd date: Feb 19, 23, 24). **✅ KYBBA budget CONFIRMED $50/day** (resolves #35 flag). **✅ Known Issue #2 RESOLVED** — PAUSED campaigns now correctly synced. KYBBA marginal ROAS unchanged 0.61× (Feb 19→24). Consecutive-day snapshot deltas confirmed useless ($0.22-$1.43 on $50-100/day budgets = Meta reporting lag).
- **Cycle #37 (P2 — think.txt audit):** **🔴 Fixed BACKWARDS marginal ROAS guidance** in think.txt — was saying "prefer consecutive daily" but empirical data proves opposite (consecutive-day deltas unreliable). 5 fixes across 3 files (think.txt, chat.txt, MEMORY.md). All 3 prompts completed 3rd+ full audit cycle. TM fast scraper (`tm-monitor-fast.mjs`) observed — smart optimization, skips empty ticket API calls.
- **Cycle #38 (P4 — Alofoke surge):** **🟢 Alofoke surged to 8.73×** ROAS ($364 spend, 6 purchases, Boston 6 days out). All Zamora profitable on marginal spend (Camila Sac 6.20×, Ana 4.77×). KYBBA still 0.61-0.95× marginal, crosses 2.0 ~Mar 12-18. **🔑 Snapshot-to-live divergence documented** — all campaigns show higher live ROAS due to delayed attribution. Posted dashboard alert + Telegram.

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
- **Cycle #42 (P2 — command.txt 4th pass):** +32 lines: custom date ranges, funnel action types (`landing_page_view`, `add_to_cart`, `initiate_checkout`), `frequency` metric + fatigue thresholds, `level=ad` breakdowns, rename/create campaign. chat.txt +2 lines. Cross-checked consistent.
- **Cycle #43 (P4 — monitoring):** Data identical to #40. Confirmed Feb 25 snapshot = clean pre-change baseline (KYBBA swap + Alofoke bump both executed AFTER 00:00 UTC snapshot). Post-swap evaluation starts Feb 28.
- **Cycle #44 (P5 — proposals):** Drafted Proposal I (Client Budget Cap Monitor — alert at 80/95/100% of client spend caps) and Proposal J (Campaign Change Journal + Impact Tracker). proposals.md 248→360 lines. 9 active proposals ranked G→I→A→C→J→B→H→E→F.
- **Cycle #45 (P4 — monitoring):** ROAS all above 2.0. KYBBA marginal unchanged 0.61×. **🔑 Alofoke budget cap:** $365/$2K spent (18.2%), projected $1,865 (93.2%) — tight but planned by Jaime. Pacing: Camila 72-76% (improving, normal ramp). Live marginals: Camila Ana 4.79×, Camila Sac 6.26×, Alofoke 23.68× — all strongly profitable.

**Key findings preserved from Cycles #39-45:**
- 🔑 Snapshot-to-live ROAS divergence scales with campaign age — use live for young campaigns, snapshots for trends
- 🔑 Feb 25 snapshot = clean pre-change baseline (both KYBBA swap + Alofoke bump executed after it)
- 🔑 Post-KYBBA swap evaluation: first data Feb 26, first reliable marginal Feb 28
- 🔑 Alofoke $2K cap: $365 spent, projected $1,865 at $250/day × 6 remaining days
- 🔑 KYBBA 2.0× crossing: Mar 12 (conservative) → Mar 18 (live). Show Mar 22. Buffer 4-10 days.
- All 3 prompts completed 4th pass (command.txt Cycle #42, chat.txt #42)
- Proposals expanded to 9 (I: Budget Cap Monitor, J: Change Journal). Ranking: G→I→A→C→J→B→H→E→F
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), **#39-45 (#46)**

## 2026-02-24/25 — Cycles #46-53 Summary (Houston Detection + Discord Restructuring)

> Condensed from 8 entries during Cycle #58 memory maintenance. See git history for originals.

- **Cycle #46 (P3 — memory):** Condensed #39-45. KYBBA marginal 0.61× (snapshot) / 0.95× (live). KYBBA swap executed ~01:00 UTC Feb 25. Post-swap evaluation starts Feb 28. Shows: Alofoke Boston Mar 2 (ACTIVE $250/day).
- **Cycle #47 (P4 — monitoring, Feb 25 snapshots):** **🔴 NEW CAMPAIGN: Houston** — $400/day budget, $0 spend, 0 impressions. Alert + Telegram posted. KYBBA marginal improved 0.61→0.95× (Feb 19→25, pre-swap). Zamora marginals all healthy (Alofoke 23.4×, Ana 4.76×, Sac 6.16×). Campaign count 17→18 (5 ACTIVE).
- **Cycle #48 (P2 — chat.txt 4th pass):** +30 lines: custom date ranges, level=ad breakdowns, delivery diagnosis workflow, actions field on today query. Cross-checked with command.txt for consistency.
- **Cycle #49 (P3 — memory, retroactive log):** Updated MEMORY.md: pipeline status, known issues, campaign landscape, proposals. Logging gap — reconstructed by Cycle #50.
- **Cycle #50 (P4 — monitoring):** Houston still $0 after 2-8.5h ACTIVE. All other campaigns stable. KYBBA post-swap evaluation deferred to Feb 28.
- **Cycle #51 (P3/P6 — retroactive log):** Updated MEMORY.md: event_snapshots populated (72 rows), CLI v2.1.55. Logging gap — reconstructed by Cycle #52.
- **Cycle #52 (P6 — infra):** ALL GREEN. .env ✅, endpoints ✅, scheduler ✅, CLI ✅, 4 snapshot dates ✅. Houston still $0. Fixed condensation defect (duplicate #41-45 entries). Logging gap pattern identified (sessions ending before writing).
- **Cycle #53 (P4/P1 — restructuring crisis):** 🔴 .env MISSING, scheduler DOWN, session/ gone — Jaime restructuring agent to multi-agent Discord system. 7 new prompt files (boss, media-buyer, discord-agent, client-manager, creative-agent, reporting-agent, tm-agent). New runner features (resumeSessionId, directSystemPrompt, --setting-sources local). Activity log system. Houston status UNKNOWN.

**Key findings preserved from Cycles #46-53:**
- 🔑 Houston detected at $400/day with $0 spend (later raised to $1,500/day) — critical delivery issue or zero-attribution
- 🔑 KYBBA marginal improved from 0.61× to 0.95× (pre-swap, Feb 19→25)
- 🔑 KYBBA adset swap: V9+V1 paused, V5+Asset1 activated (~01:00 UTC Feb 25). First post-swap snapshot Feb 26.
- 🔑 Agent architecture evolved: single Telegram bot → multi-agent Discord command center (7 specialized agents)
- 🔑 chat.txt completed 4th pass with delivery diagnosis workflow
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
- Condensation history: #0-3, #4-7, #8-9, #10-11 (#14), #12-17 (#20), #18-21 (#24), #22-28 (#29), #30-34 (#35), #35-38 (#39), #39-45 (#46), #46-53 (#58), **#54-56 (#57)**

## 2026-03-04/05 — Cycles #57-61 Summary (Data Gap Recovery + Major Landscape Change)

> Condensed from 5 detailed entries during Cycle #62 memory maintenance. See git history for originals.

- **Cycle #57 (P3 — memory):** Condensed Cycles #54-56. MEMORY.md verified. 7-day snapshot gap (Feb 27-Mar 4) most critical unresolved issue. Jaime actively building TM1 scraper (40+ session files).
- **Cycle #58 (P4 — monitoring):** Data still stale (Feb 26). Root cause confirmed: Discord restructuring broke Meta sync cron — only heartbeats survived. Last `meta-ads` job was Feb 18 (14 days). Marginal ROAS from Feb 24→26: KYBBA 1.66×, Alofoke 13.24×, Ana 2.69×, Sac 6.39×, Houston 0.0×.
- **Cycle #59 (P6 — infra):** ALL endpoints alive. CLI v2.1.68. .env 23 vars ✅. New `assistant` job from Jaime (19:08 UTC) — interacting with agent via Discord. Meta sync still broken.
- **Cycle #60 (P2 — prompt audit):** **🔴 Alert levels bug found in 3 prompt files** — command.txt, chat.txt, media-buyer.txt all used "warning"/"critical" instead of Zod-validated "warn"/"error". Would silently reject all alert POSTs from those modes. Fixed all 3 files + added explicit Zod warning. think.txt: updated P2 rotation list to all 10 files + added missing Supabase tables.
- **Cycle #61 (P4 — major landscape change):** **Snapshots RESUMED** (Mar 5, 10 rows). Campaign count 18→25, ACTIVE 5→10. **7 new campaigns** including 2 new clients (Sienna, Vaz Vil). Houston + Alofoke PAUSED. **KYBBA marginal 4.67×** — crisis averted, adset swap confirmed effective. **San Diego 0.95× with $300/day** — alert posted. Sienna 0× with $200/day flagged. Telegram drafted.

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

## 2026-03-05 ~14:30 CST -- Cycle #82 (Memory Maintenance)
- **Priority chosen:** P3 — Memory Maintenance (rotation from P4 #81)
- **Action taken:** Condensed #77-81. MEMORY.md updates (San Diego RESOLVED, campaign counts, show statuses).
- **Next priority:** P4/P5/P6/P2 (avoid P3).

## 2026-03-05 ~15:30 CST -- Cycle #83 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (rotation from P3 #82)
- **What I audited or read:** session/last-campaigns.json (mtime 12:01 CST, fresh), campaign_snapshots (75 rows, 7 dates), EATA data, agent_jobs heartbeats
- **Campaign landscape:** 9 ACTIVE (unchanged from #82). 25 total.
- **Marginal ROAS (Feb 26→Mar 5, 7-day gap):**
  - KYBBA 4.67x (stable 8+ cycles — definitively recovered)
  - Camila Sac 4.64x, Camila Ana 5.26x — both healthy
  - Phoenix, SLC, SF, Palm Desert, Sienna, Vaz Vil — only 1 snapshot each, no marginal available
- **Blended ROAS (live):**
  - KYBBA 2.68x (show Mar 22) — healthy
  - Camila Sac 4.81x, Camila Ana 4.11x — strong
  - SLC 20.2x — exceptional performer
  - SF 3.45x — recovered
  - Phoenix 1.88x at $300/day (show Mar 8 = 3 DAYS!) — 🔴 snapshot was 2.26x at midnight, dropped to 1.88x by midday = intraday decline
  - Palm Desert 0.39x at $50/day — 🔴 1 purchase total
  - Sienna $496/0x at $200/day — 🔴 persistent zero conversions (8+ days)
  - Vaz Vil $53/0x at $50/day — 🟡 only 2 days old
- **EATA Don Omar BCN:** 30,052 tickets, 3.2M EUR, 442/day — unchanged from #81
- **Alert posted:** Phoenix + Sienna + Palm Desert (combined $550/day underperforming). 200 OK.
- **Snapshot gap note:** Many campaigns started after Feb 26 and only have Mar 5 snapshot. Next snapshot (Mar 6) will enable marginal ROAS for these.
- **No Telegram draft** — flags are persistent (already alerted in prior cycles). Phoenix show proximity (3 days) is the most urgent but Jaime is actively managing.
- **Next priority:** P2 (prompt audit) or P5 (proposals). Avoid P4 per rotation.

## 2026-03-05 ~16:00 CST -- Cycle #84 (Prompt Audit — chat.txt 5th pass)
- **Priority chosen:** P2 — Prompt Audit (rotation from P4 #83; chat.txt last audited Cycle #48)
- **What I audited or read:** chat.txt (445 lines pre-edit), MEMORY.md (full read for cross-check)
- **Gaps found (3):**
  1. **Missing client aliases** — Sienna, Vaz Vil, Don Omar BCN not listed. Real bug: agent would say "I don't know that client" if Jaime asks via Telegram.
  2. **Missing pixel ID for Sienna** — adset creation example hardcoded default pixel only. Sienna uses pixel 918875103967661.
  3. **No EATA/Vivaticket section** — Don Omar BCN has no Meta campaigns; agent had no Supabase query pattern to answer questions about it.
- **Action taken:**
  1. Added 3 client aliases (Sienna, Vaz Vil, Don Omar BCN) to alias section
  2. Added pixel ID note under adset creation (default + Sienna pixels)
  3. Added EATA/Vivaticket section with Supabase query for Don Omar BCN event data
  4. chat.txt: 445 -> 463 lines (+18)
- **Cross-check:** All 3 additions consistent with MEMORY.md (pixel IDs, slugs, EATA event ID eata_14948, venue, date)
- **No Telegram draft** — routine prompt maintenance
- **Next priority:** P5 (proposals) or P6 (infra) or P3 (memory). Avoid P2 per rotation.

## 2026-03-05 ~16:30 CST -- Cycle #85 (Proposals Overhaul)
- **Priority chosen:** P5 — Knowledge Expansion / Proposals (rotation from P2 #84)
- **What I audited or read:** LEARNINGS.md (full), session/last-campaigns.json, campaign_snapshots, agent_jobs heartbeats
- **P1 check:** No breakage. Scheduler alive (heartbeats at 22:28-22:30 UTC). Data fresh (12:01 CST).
- **Action taken:**
  1. **Recreated session/proposals.md** (file was lost during Discord restructuring). 8 proposals ranked A-H:
     - A: Zero-Conversion Auto-Detector (LOW effort, HIGH impact — would have caught Sienna 5 days earlier and Houston at $1,500/day)
     - B: Show Proximity ROAS Gate (auto-alert when ROAS < 2.0 within 3 days of show)
     - C: Client Budget Cap Monitor (prevent overspend on client caps like Alofoke $2K)
     - D: Campaign-Event Auto-Linking (core value prop — ad spend to ticket sales attribution)
     - E: Marginal ROAS Dashboard Widget (visualize the metric that caught KYBBA decline)
     - F: Ad Health Scan (detect WITH_ISSUES ads like error 2490085)
     - G: Campaign Change Journal (structured history of all changes)
     - H: EATA Sell-Through Velocity Dashboard (project Don Omar BCN sell-out date)
  2. **6 completed proposals documented** (spend bug, snapshots, PAUSED sync, TM scraper, EATA, alert levels)
  3. Key shift from previous proposals: A (Zero-Conversion) is new #1 priority — directly addresses the pattern of Sienna ($496/0 purchases) and Houston ($242→$1,500/day at 0x) that has been the most costly recurring issue
- **No Telegram draft** — routine proposals work
- **Next priority:** P4 (monitoring), P6 (infra), or P3 (memory). Avoid P5 per rotation.

## 2026-03-05 ~17:00 CST -- Cycle #86 (Infrastructure Check)
- **Priority chosen:** P6 — Infrastructure Check (rotation from P5 #85)
- **What I audited or read:** .env (25 vars), session cache mtimes, agent_jobs heartbeats, endpoint liveness
- **Infrastructure status — all green:**
  - INGEST_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: all set ✅
  - Ingest endpoint: 400 (alive, missing payload fields) ✅
  - Alerts endpoint: 401 (alive, wrong secret — Clerk auth bug NOT regressed) ✅
  - claude CLI: found at /Users/jaimeortiz/.local/bin/claude ✅
  - Scheduler: heartbeats every ~1 min, latest 23:00 UTC (17:00 CST) ✅
  - last-campaigns.json: 12:01 CST today (fresh, <5h old) ✅
  - last-events.json: 18:03 CST yesterday (26h old — slightly stale but TM data changes slowly) ✅
  - EATA auth: 10:15 CST today (fresh) ✅
  - proposals.md: exists (recreated in #85) ✅
- **Minor note:** `source .env` in bash doesn't work reliably (likely special chars in token values). Use `grep KEY .env | cut -d= -f2` pattern instead. Not a bug — Node dotenv handles it fine.
- **TM session files:** No tm-*.json or tm-*-stderr.log files exist. TM scraper output may be going elsewhere or not running. Not critical — TM One API has known permission limitations (see MEMORY.md).
- **No Telegram draft** — routine infra check, everything healthy
- **Next priority:** P4 (monitoring) or P3 (memory). Avoid P6 per rotation.

## 2026-03-05 ~17:30 CST -- Cycle #87 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (rotation from P6 #86)
- **What I audited or read:** session/last-campaigns.json (mtime 12:01 CST, fresh), campaign_snapshots (latest Mar 5), EATA tm_events, agent_jobs heartbeats
- **Campaign landscape:** 9 ACTIVE, 25 total (unchanged from #83)
- **No new snapshots since #83** — still only Mar 5 as latest date. Next snapshot (Mar 6) will be first chance at marginal ROAS for newer campaigns.
- **Marginal ROAS (Feb 26 to Mar 5, unchanged):** KYBBA 4.67x, Camila Sac 4.64x, Camila Ana 5.26x — all healthy and stable 9+ cycles
- **Live ROAS:** KYBBA 2.68x, Sac 4.81x, Ana 4.11x, SLC 20.2x, SF 3.45x — all healthy
- **Persistent flags (unchanged):**
  - Phoenix 1.88x at $300/day, show Mar 8 (3 days) — most urgent
  - Sienna $496/0x at $200/day (9+ days, zero conversions)
  - Palm Desert 0.39x at $50/day (1 purchase total)
  - Vaz Vil $53/0x at $50/day (3 days old, still early)
- **EATA Don Omar BCN:** 30,052 tickets, revenue_today $46K — unchanged
- **Scheduler:** heartbeats current (23:31 UTC)
- **No alert posted** — all flags are persistent from prior cycles, already alerted
- **No Telegram draft** — no new anomalies
- **Next priority:** P3 (memory condensation — 10 uncondensed cycles #82-87) or P2 (prompt audit). Avoid P4.
