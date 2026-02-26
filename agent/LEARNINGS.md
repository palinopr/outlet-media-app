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

## 2026-02-24 ~23:30 UTC — Cycle #46 (Memory Maintenance)
- **Priority chosen:** P3 — Memory Maintenance (rotation-compliant — last was P4 Cycle #45, last P3 was Cycle #39 — most overdue at 6 cycles)
- **P1 check:** No breakage. Scheduler alive (heartbeats 18:58-19:00 UTC). Endpoints: ingest 401 ✅, alerts 401 ✅. All green.
- **What I audited or read:**
  - Session cache (mtime 12:01 CST Feb 24, ~1h old): 4 ACTIVE campaigns, values match Supabase exactly
  - Supabase meta_campaigns: 4 ACTIVE — KYBBA ($2,423, 2.47×), Alofoke ($365, 8.72×), Camila Sac ($362, 4.43×), Camila Ana ($379, 3.81×)
  - campaign_snapshots: 3 dates (Feb 19, 23, 24). No Feb 25 yet (00:00 UTC hasn't fired). 15 campaigns on Feb 24.
  - Feb 23→24 snapshot deltas: $0.22-$1.43 across all campaigns — consecutive-day lag confirmed again
- **ROAS check:** All ACTIVE above 2.0. KYBBA 2.47× (lowest, declining). Others healthy (3.8-8.7×).
- **Marginal ROAS (Feb 19→Feb 24 snapshot, 5-day gap):**
  - **KYBBA: 0.61×** — unchanged from Cycle #25. Still losing on new spend.
  - Live marginal (vs Feb 19 snapshot): **0.95×** — closer to breakeven with delayed attribution, but still below 1.0.
  - New campaigns (Alofoke, Camila) only have consecutive-day snapshots — marginal ROAS not calculable (need Feb 19→25+ gap, but they didn't exist on Feb 19). First meaningful marginal: compare Feb 23 snapshot to Feb 26+ snapshots.
- **KYBBA 2.0× crossing projection (refined):**
  - Conservative (snapshot marginal 0.61×): ~Mar 11
  - Live (live marginal 0.95×): ~Mar 17
  - Range: **Mar 11-17.** Show date Mar 22. Buffer: 5-11 days.
- **Pacing (ACTIVE):**
  - Camila Sac: 72.5% ($362/$500 expected over 5 days) — improving from 64-68%
  - Camila Ana: 75.7% ($379/$500) — improving
  - Alofoke: ~73% ($365/$500 at pre-bump $100/day rate) — budget just bumped to $250/day, pacing will change rapidly
  - KYBBA: skipped (pause history)
- **Status changes:** None. Still 4 ACTIVE, 13 PAUSED. No new campaigns.
- **🔑 Post-swap timing analysis:**
  - KYBBA adset swap executed ~19:00 CST Feb 24 = ~01:00 UTC Feb 25
  - Feb 25 snapshot fires 00:00 UTC Feb 25 — this is 1 hour BEFORE the swap, so will NOT capture swap effects
  - First snapshot with post-swap data: **Feb 26** (00:00 UTC, captures 6 PM CST Feb 25 = ~17h post-swap)
  - First reliable post-swap marginal ROAS: **Feb 28** (need 2+ day gap from Feb 26 per established guidance)
  - Bottom line: don't evaluate swap effectiveness until Feb 28 cycle at earliest
- **Shows imminent:** Seattle TOMORROW (Feb 25, campaign PAUSED — likely intentional), Portland Feb 26 (PAUSED), Alofoke Boston Mar 2 (ACTIVE, $250/day scaling).
- **No Telegram draft** — no new anomalies. KYBBA marginal ROAS unchanged. All previously flagged.
- **Next priority:** P6 — Infrastructure Check (hasn't been done since Cycle #33, 8 cycles ago). Or P2 — Prompt Audit (all 3 completed 3rd pass at Cycle #37, due for 4th). Avoid P4 next per rotation.

## 2026-02-25 ~00:30 UTC — Cycle #47 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (rotation-compliant — last was P3 Cycle #46. Feb 25 snapshots just arrived — highest-value P4 cycle)
- **P1 check:** No breakage. Scheduler alive (heartbeats 00:26-00:30 UTC Feb 25). Endpoints: ingest 401 ✅, alerts 401 ✅ (posted alert successfully). All green.
- **What I audited or read:**
  - LEARNINGS.md (full), MEMORY.md (full)
  - Session cache: campaigns 18:01 UTC Feb 24 (~6h old), events 18:02 UTC (~6h old)
  - Supabase meta_campaigns: **5 ACTIVE** (was 4) — new campaign detected
  - Supabase campaign_snapshots: **4 dates now** (Feb 19, 23, 24, 25). 5 campaigns on Feb 25.
- **🔴 NEW CAMPAIGN DETECTED: "Zamora - Camila - Houston"**
  - Campaign ID: 120242223711720525
  - Status: ACTIVE, Budget: **$400/day** (highest in portfolio — 8× KYBBA, 4× Alofoke original)
  - Spend: **$0**, Impressions: 0, Clicks: 0, ROAS: 0
  - Start time: Feb 19 (same cohort as other Camila campaigns)
  - **No Houston event found in TM One data** (checked all 25 events)
  - Campaign count: 17→18 total (5 ACTIVE, 13 PAUSED)
  - Assessment: Most likely was PAUSED since creation and Jaime just activated it. $0 spend could be normal if just activated (delivery takes hours) OR indicates a delivery issue. The $400/day budget makes this high-priority — that's $2,800/week if it starts delivering.
  - **Dashboard alert posted** (warning level) ✅
  - **Telegram draft saved** ✅
- **KYBBA Marginal ROAS — Improved to 0.95×:**
  - Feb 19→25 (6-day gap): Δspend=$353.91, Δrevenue=$336.17, **marginal=0.95×** (was 0.61× at Feb 19→24)
  - Feb 24→25 (1-day, noisy but plausible): Δspend=$53.60, Δrevenue=$152.06, **marginal=2.84×**
  - The $53.60 single-day spend delta is realistic for $50/day budget — this may be meaningful, not noise
  - Feb 24 was KYBBA's best day: 5 purchases, $77, 5.21× (confirmed in session)
  - **Important:** Feb 25 snapshot is PRE-SWAP (swap was 01:00 UTC, snapshot at 00:00 UTC). So this improvement is from existing adsets before the swap.
  - 2.0× crossing projection: **~Mar 18** at 0.95× marginal (was Mar 12 at 0.61×). Show Mar 22 = 4 days buffer.
  - Cautiously optimistic — if pre-swap KYBBA was already improving, post-swap should be even better.
- **Zamora Campaign Marginals (Feb 23→25, 2-day gap):**
  - Alofoke: **23.4×** marginal (attribution catch-up — blended jumped 3.67→8.72×). Exceptional but inflated by delayed attribution on a young campaign.
  - Camila Anaheim: **4.76×** marginal. Blended improved 3.42→3.81×. Healthy.
  - Camila Sacramento: **6.16×** marginal. Blended improved 3.67→4.42×. Healthy.
  - All Zamora campaigns strongly profitable on new spend.
- **ROAS trend (4 snapshot dates):**
  - KYBBA: 2.73 → 2.46 → 2.46 → 2.47. Slight uptick on Feb 25 — first non-decline in the series!
  - Alofoke: 3.67 → 3.66 → 8.72. Major attribution catch-up.
  - Camila Ana: 3.42 → 3.41 → 3.81. Improving.
  - Camila Sac: 3.67 → 3.65 → 4.42. Improving.
- **Status changes:** 4→5 ACTIVE (Houston new). No ACTIVE→PAUSED changes. 13 PAUSED unchanged.
- **Alofoke budget cap:** $365 of $2K spent (18.2%). At $250/day × 5 remaining days = $1,250 + $365 = $1,615 projected (80.8%). Healthy headroom.
- **Shows:** Seattle TODAY (PAUSED), Portland TOMORROW (PAUSED), Alofoke Boston Mar 2 (5 days, ACTIVE).
- **MEMORY.md updated:** Campaign landscape (17→18, 4→5 ACTIVE, Houston added), snapshot count (3→4 dates), KYBBA marginal (0.61→0.95×), show dates refreshed, Known Issues updated.
- **Telegram draft saved** — Houston $400/day $0 spend + KYBBA improvement summary.
- **Next priority:** P2 — Prompt Audit (4th pass, start with chat.txt — last updated Cycle #42). Or P3 — Memory Maintenance (proposals section stale). Avoid P4 next per rotation.

## 2026-02-25 ~01:15 UTC — Cycle #48 (Prompt Audit — chat.txt 4th pass)
- **Priority chosen:** P2 — Prompt Audit (rotation-compliant — last was P4 Cycle #47, last P2 was Cycle #42 command.txt 4th pass)
- **P1 check:** ALL GREEN. Scheduler alive (01:00 UTC heartbeats). Endpoints: ingest 401 ✅, alerts 401 ✅. Session cache ~7h old.
- **What I audited or read:**
  - LEARNINGS.md (full), MEMORY.md (full)
  - prompts/chat.txt (361 lines, last updated Cycle #42 — minor frequency/funnel additions)
  - prompts/command.txt (708 lines, cross-referenced for gap analysis)
  - session/last-campaigns.json (5 ACTIVE, Houston $0 spend confirmed)
- **4 gaps found and fixed in chat.txt (+30 lines, 361→391):**
  1. **Custom date range** (+7 lines) — added `time_range` URL-encoded JSON parameter for arbitrary date windows. Essential for Telegram questions like "how did KYBBA do this week?" Was in command.txt but missing from chat.txt.
  2. **Per-ad insights (`level=ad`)** (+6 lines) — added `level=ad` breakdown query alongside existing `level=adset`. Proven need from KYBBA deep dive (identifying best/worst individual ads).
  3. **Delivery diagnosis section** (+14 lines) — full "why isn't my campaign spending?" workflow: check effective_status, check adsets, check ads for WITH_ISSUES, check account-level, fresh activation timing. Directly addresses Houston $0 spend scenario from Cycle #47. Was in command.txt (ad delivery error section) but chat.txt had no diagnostic path at all.
  4. **`actions` field added to today query** (+1 line) — today insights was missing `actions` field, making purchase/CPA calculations impossible from `date_preset=today`. Minor but impactful.
- **Cross-check:** Both prompts now consistent on: custom date ranges, level=adset + level=ad, delivery diagnosis, insights fields (including actions on all queries), client slug mappings, Supabase column naming, error codes. API version v21.0 and ad account ID match across all references.
- **No Telegram draft** — routine prompt improvement, no business anomaly.
- **Next priority:** P3 — Memory Maintenance (MEMORY.md proposals section stale from Cycle #44 additions, show dates need refresh — Seattle is TODAY/past). Or P4 — Business Monitoring (Feb 25 data is in, Houston delivery status unknown). Avoid P2 next per rotation.

## 2026-02-25 ~01:45 UTC — Cycle #49 (Memory Maintenance — retroactive log)
> **Note:** This cycle updated MEMORY.md extensively (Data Pipeline Status, Known Issues, Campaign Landscape, Proposals Status — all marked "Cycle #49") but failed to log itself in LEARNINGS.md. Reconstructed retroactively by Cycle #50.
- **Priority chosen:** P3 — Memory Maintenance
- **Action taken:** Updated MEMORY.md sections: Data Pipeline Status (4 snapshot dates, pipeline verified), Known Issues (#1 Houston $0, #2 KYBBA marginal 0.95×), Campaign Landscape (5 ACTIVE/13 PAUSED/18 total, Houston added, all campaigns with current stats), Proposals Status, Upcoming Shows. All verified against Supabase.
- **Logging gap:** LEARNINGS.md entry was not written. Cause unknown (likely session ended before logging).

## 2026-02-25 ~02:32 UTC — Cycle #50 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (rotation-compliant — last logged was P2 #48, #49 was P3. Houston $0 spend needs follow-up)
- **P1 check:** ALL GREEN. Scheduler alive (heartbeats 02:27-02:31 UTC Feb 25). Endpoints: ingest 401 ✅, alerts 401 ✅. No Clerk regression. Session cache: campaigns 00:01 UTC (2.5h old), events 02:03 UTC (30min old).
- **What I audited or read:**
  - LEARNINGS.md (full), MEMORY.md (full)
  - Supabase meta_campaigns: 5 ACTIVE (unchanged from Cycle #47)
  - Supabase campaign_snapshots: 4 dates (Feb 19, 23, 24, 25)
  - Session cache (matches Supabase exactly — same 00:00 UTC sync)
  - TM scraper logs: both fast variants healthy, 25 events, no errors
  - Agent heartbeats: current (02:27-02:31 UTC)
- **🔴 Houston $0 spend — PERSISTS (2h since detection):**
  - Campaign 120242223711720525, $400/day budget, 0 impressions, 0 clicks, 0 reach
  - Session cache (from 00:01 UTC sync) shows ACTIVE with $0 — same as Cycle #47
  - **Timing refinement:** Houston first appeared in ACTIVE status at 00:00 UTC Feb 25 sync. It was PAUSED (or non-existent in cache) at the prior sync. Activation window: 18:00 UTC Feb 24 → 00:00 UTC Feb 25 (6h window). So Houston has been ACTIVE for 2.5-8.5 hours.
  - **Assessment:** If activated near the end of the window (e.g., 22:00 UTC), 4.5h of $0 delivery could be normal Meta ramp-up. If activated near the start (18:00 UTC), 8.5h with 0 impressions is a delivery problem.
  - **Next checkpoint: 06:00 UTC Feb 25 sync** (~3.5h from now). If still $0 after 8-14.5 hours ACTIVE, almost certainly a delivery issue (ads WITH_ISSUES, adset targeting too narrow, or account-level issue).
  - Dashboard alert already posted (Cycle #47). No new alert needed.
- **All other campaigns — unchanged from Cycle #47:**
  - KYBBA: $2,423, 2.47× (marginal 0.95× Feb 19→25). Pre-swap data only.
  - Alofoke: $365, 8.72× (marginal 23.4× Feb 23→25, attribution catch-up). $2K cap: $1,615 projected (80.7%).
  - Camila Ana: $379, 3.81× (marginal 4.76×). Pacing ~72%.
  - Camila Sac: $363, 4.42× (marginal 6.16×). Pacing ~68%.
  - **No threshold breaches.** All ACTIVE above 2.0.
- **ROAS trends (4 snapshots):** KYBBA 2.73→2.46→2.46→2.47 (tiny uptick). Alofoke/Camila all improving. No 3-consecutive-decline flags.
- **Status changes:** None. 5 ACTIVE, 13 PAUSED, 18 total.
- **Shows:** Seattle Feb 25 (TODAY, PAUSED — intentional), Portland Feb 26 (TOMORROW, PAUSED), Alofoke Boston Mar 2 (5 days, ACTIVE $250/day).
- **KYBBA post-swap:** Swap at 01:00 UTC Feb 25. Feb 25 snapshot was 00:00 UTC = pre-swap. First post-swap snapshot: Feb 26. First reliable marginal: Feb 28. Do not evaluate before then.
- **Cycle #49 logging gap fixed** — retroactive entry added above.
- **No Telegram draft** — Houston already alerted (Cycle #47), no new anomalies. All campaigns tracked.
- **Next priority:** P6 — Infrastructure Check (last done Cycle #41, 9 cycles ago — most overdue). Or P5 — Knowledge Expansion (last done Cycle #44, 6 cycles ago). Avoid P4 next per rotation.

## 2026-02-25 ~03:00 UTC — Cycle #51 (Memory Maintenance/Infra — retroactive log)
> **Note:** This cycle updated MEMORY.md (Data Pipeline verified, event_snapshots now populated w/ 72 rows, CLI v2.1.55) but failed to log itself in LEARNINGS.md. Reconstructed retroactively by Cycle #52. Third logging gap (after Cycles #49, #51).
- **Priority chosen:** P3/P6 hybrid (based on MEMORY.md edits referencing "Cycle #51")
- **Action taken:** Updated MEMORY.md Data Pipeline Status (event_snapshots confirmed populated — 72 rows, 3 dates), Claude CLI v2.1.52 → v2.1.55. All data pipeline items verified.
- **Logging gap:** LEARNINGS.md entry not written. Cause: likely session ended before logging (same pattern as Cycle #49).

## 2026-02-25 ~04:30 UTC — Cycle #52 (Infrastructure Check)
- **Priority chosen:** P6 — Infrastructure Check (rotation-compliant — last logged P6 was Cycle #41, 11 cycles ago — most overdue priority. Last cycle was P4 #50, #51 was P3/P6 hybrid)
- **P1 check:** No breakage. Scheduler alive (heartbeats 04:29-04:31 UTC, live). Endpoints: ingest 401 ✅, alerts 401 ✅. No Clerk regression.
- **What I audited or read:**
  - LEARNINGS.md (full — 466 lines pre-edit, through Cycle #50)
  - MEMORY.md (full — 165 lines, references Cycle #51 updates)
  - .env: 7/7 vars set ✅ (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INGEST_URL, INGEST_SECRET, TELEGRAM_BOT_TOKEN, TM_EMAIL, TM_PASSWORD)
  - Claude CLI: **v2.1.55** ✅ (matches MEMORY.md)
  - Endpoints: ingest POST → 401 ✅ (alive), alerts POST → 401 ✅ (no Clerk 307 regression)
  - Scheduler heartbeats: **LIVE** at 04:29-04:31 UTC ✅ (1-min intervals, current)
  - Session cache: campaigns 00:01 UTC Feb 25 (~4.5h old), events 04:08 UTC Feb 25 (~22min old — TM scraper ran recently)
  - Non-heartbeat jobs: last was tm-demographics Feb 23 01:10 UTC (confirms cron doesn't create agent_jobs)
  - Campaign snapshots: **4 dates** (Feb 19: 13, Feb 23: 17, Feb 24: 15, Feb 25: 5) ✅
  - Event snapshots: **3 dates** (Feb 23: 24, Feb 24: 24, Feb 25: 24) ✅ — confirmed populated per Cycle #51 MEMORY.md update
  - TM scraper logs: fast scraper healthy (25 events via GraphQL ✅), full scraper runs but all per-event API calls return empty (known permissions issue, not critical)
  - Supabase ACTIVE campaigns: 5 (KYBBA $2,423/2.47×, Alofoke $365/8.72×, Camila Sac $363/4.42×, Camila Ana $379/3.81×, Houston $0/0.00×)
- **Action taken:**
  1. **Removed duplicate Cycles #41-45 entries** from LEARNINGS.md (~108 lines). These were detailed entries that should have been deleted during Cycle #46 condensation but were left behind. The condensed summary (lines 205-225) already captures all findings.
  2. **Added retroactive Cycle #51 entry** — third logging gap fixed (after Cycles #49, #51).
  3. **Logged this cycle (#52).**
- **🔴 Houston $0 spend — STILL PERSISTS (4+ hours since detection, 4-10h since activation):**
  - Campaign 120242223711720525, ACTIVE, $400/day budget, 0 impressions, 0 clicks
  - At 4+ hours post-detection with zero impressions on $400/day, this is increasingly likely a delivery issue (not just Meta ramp-up)
  - Dashboard alert was posted Cycle #47 — no duplicate alert needed
  - **Next checkpoint: 06:00 UTC sync** (~1.5h from now). If still $0 after this sync captures fresh Meta data, Jaime needs to investigate (check adset/ad effective_status for WITH_ISSUES)
- **Observations:**
  - bash `source .env` returns exit code 126 (permission denied on macOS). Grep-based extraction works fine. Not critical — scheduler uses Node.js dotenv, not bash source. But future think cycles should use `grep '^VAR=' .env | cut -d= -f2` pattern.
  - Session cache campaigns file (00:01 UTC) is 4.5h old — next Meta sync at 06:00 UTC. Events file (04:08 UTC) is recent.
  - LEARNINGS.md had a condensation defect from Cycle #46 — detailed entries #41-45 weren't deleted. Fixed this cycle.
  - Recurring logging gap pattern (Cycles #49, #51): sessions ending before LEARNINGS.md entry is written. Root cause likely: cycle runs out of turns or context window. No code fix available (agent infra, not think loop).
- **Infrastructure summary: ALL GREEN** — .env ✅, endpoints ✅, scheduler ✅, CLI ✅, snapshots ✅, TM scrapers ✅. Only active issue is Houston $0 delivery (business, not infra).
- **No Telegram draft** — Houston already alerted, no new infra issues. All systems operational.
- **Next priority:** P4 — Business Monitoring (highest value after 06:00 UTC sync — Houston checkpoint + possible new data). Or P2 — Prompt Audit (think.txt 4th pass, last audited Cycle #37). Avoid P6 next per rotation.

## 2026-02-25 ~22:33 UTC — Cycle #53 (Business Monitoring + P1 Assessment)
- **Priority chosen:** P4 — Business Monitoring (rotation-compliant — last was P6 #52. Houston checkpoint overdue, new snapshots expected)
- **P1 check: 🔴 MAJOR — Agent environment disrupted during restructuring**
  - **`.env` file MISSING from disk** — not just gitignored, genuinely gone. Was present as recently as Cycle #52 (~04:30 UTC today). Blocks all Supabase queries, endpoint checks, and scheduled operations.
  - **No scheduler process running** — `ps aux` shows no node/tsx agent process. No heartbeats, no syncs, no think cycles running.
  - **`session/` directory does NOT exist** — index.ts auto-creates it on startup, so this confirms scheduler hasn't run since the restructuring.
  - **`.env.local` (Meta credentials) still exists** in parent directory ✅
  - **Assessment:** Jaime has been actively restructuring the agent today (all file timestamps Feb 25 13:25-16:29). This appears to be **work-in-progress**, not accidental breakage. The scheduler hasn't been restarted after the code changes. Likely intentional — Jaime is adding Discord bot integration and hasn't created `.env` from `.env.example` yet.
  - **Impact:** No monitoring possible this cycle. Can't query Supabase, can't check endpoints, can't check Houston $0 spend status.
- **What I audited or read:**
  - LEARNINGS.md (full, 396 lines — through Cycle #52)
  - MEMORY.md (full, 170 lines)
  - Agent directory listing (no .env, no session/)
  - Git log (15 recent commits — major Discord integration)
  - Git status (6 new prompt files, 8 modified files, discord-admin.txt→discord-agent.txt rename)
  - New files: scheduler.ts, runner.ts, index.ts, boss.txt, media-buyer.txt, discord-agent.txt
  - CLAUDE.md (unchanged, still references old file structure)
- **🔑 MAJOR ARCHITECTURAL SHIFT — Multi-Agent Discord System:**
  - Agent has evolved from single Telegram bot → **multi-agent Discord command center**
  - **7 NEW specialized prompt files** (all created today):
    1. `boss.txt` — COO orchestrator agent. Sits in #boss channel. Reads activity log across all channels, synthesizes briefings, updates MEMORY.md, creates skills.
    2. `media-buyer.txt` — Meta Ads specialist. Full API access, executes changes. Replaces command.txt for ad operations.
    3. `discord-agent.txt` — Discord server management. Channels, roles, permissions, auto-moderation. Guild ID: 1340092028280770693.
    4. `client-manager.txt` — client-facing operations (not fully read this cycle)
    5. `creative-agent.txt` — ad creative management (not fully read this cycle)
    6. `reporting-agent.txt` — performance reports (not fully read this cycle)
    7. `tm-agent.txt` — Ticketmaster data (not fully read this cycle)
  - **Existing prompts retained:** command.txt, chat.txt, think.txt (all unchanged)
  - `prompts/discord-admin.txt` DELETED → replaced by `discord-agent.txt`
  - **New code files:** `discord-admin.ts` (channel management), `discord-router.ts` (message routing), `discord-restructure.ts` (server setup)
  - **Scheduler changes:** Added Discord health check cron (every 12h), Discord channel notifications (active-jobs, tm-data, performance, agent-alerts), `triggerManualJob()` for Discord-triggered runs
  - **Runner changes:** Added `resumeSessionId` (multi-turn context), `directSystemPrompt` (runtime injection), `onChunk` (live streaming), `--setting-sources local` (blocks global memory)
  - **Activity log system:** `session/activity-log.json` — cross-channel coordination file for Boss agent
  - **Skills directory:** `skills/` created (empty, .gitkeep only)
  - **New .env vars needed:** DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_LOG_CHANNEL_ID, DISCORD_WELCOME_CHANNEL_ID, DISCORD_DEFAULT_ROLE_ID, DISCORD_EXEMPT_CHANNELS, DISCORD_BANNED_WORDS, TELEGRAM_CHAT_ID, CLAUDE_PATH, CHECK_CRON
- **Houston $0 spend — STATUS UNKNOWN:**
  - Was flagged Cycle #47 (~00:30 UTC Feb 25). Next checkpoint was 06:00 UTC sync (~16h ago).
  - Cannot check without Supabase access. This is now stale — ~22h since first detection.
  - Jaime has been actively working on the codebase today, so he's likely aware of campaign status.
- **MEMORY.md/CLAUDE.md staleness:**
  - CLAUDE.md still references old file structure (session/last-campaigns.json, prompts/command.txt as primary). Doesn't mention Discord architecture, new prompt files, or multi-agent system. Needs update.
  - MEMORY.md doesn't reflect the Discord integration, new prompt file inventory, or architectural shift. Needs update, but since `.env` is missing, some entries (like "scheduler alive") are now wrong.
  - Will defer MEMORY.md updates to next cycle when state is clearer (Jaime may still be mid-restructure).
- **Observations:**
  - `index.ts` creates `session/` on startup — confirms dir is runtime-created, not missing from a bug
  - Think loop still uses `prompts/think.txt` (unchanged). But the new multi-agent system may change how think cycles work in the future.
  - `discord-agent.txt` hardcodes Guild ID `1340092028280770693` — should be in .env or MEMORY.md
  - Runner added `--setting-sources local` flag — this blocks global project memory, which is the proper fix for context bleed (previously handled only by warning text in prompts)
- **No Telegram draft** — Jaime is actively developing. The missing .env and stopped scheduler are expected during restructuring, not an alert-worthy event. Houston status unknown but Jaime is actively at his computer working.
- **Next priority:** P3 — Memory Maintenance (MEMORY.md needs significant updates for the new architecture once restructuring stabilizes). Or P2 — audit the new prompt files (boss.txt, media-buyer.txt etc.) for consistency with MEMORY.md. Avoid P4 next (can't do monitoring without .env). **Critical dependency: .env must be recreated before monitoring can resume.**

## 2026-02-25 ~23:03 UTC — Cycle #54 (Prompt Audit — New Discord Agent Prompts)
- **Priority chosen:** P2 — Prompt Audit (rotation-compliant — last was P4/P1 #53. Audited all 7 new Discord prompt files created during restructuring)
- **P1 check: ✅ RESOLVED** — All P1 issues from Cycle #53 fixed:
  - `.env` ✅ restored (19 vars, all expected keys present including Discord, TM, Supabase, Ingest)
  - Scheduler ✅ running (PID 87179, started 4:40 PM CST, heartbeats every minute)
  - `session/` ✅ exists (empty — expected, no cron has fired yet. First sync ~00:00 UTC = 6 PM CST)
- **What I audited:** All 10 prompt files: boss.txt, media-buyer.txt, client-manager.txt, creative-agent.txt, reporting-agent.txt, tm-agent.txt (new), plus command.txt, chat.txt, think.txt (existing, unchanged)
- **Cross-consistency findings:**
  1. ✅ **Client aliases**: Identical across all 7 agent prompts — zamora, kybba, alofoke, camila, beamina, happy_paws
  2. ✅ **Credential extraction**: All use `grep X .env | cut -d= -f2` pattern. All reference `../.env.local` for META_ACCESS_TOKEN
  3. ✅ **API version**: All use v21.0 consistently
  4. ✅ **Ad account ID**: All use act_787610255314938
  5. ✅ **Pixel ID**: All use `879345548404130` consistently within agent context
  6. ✅ **Context bleed warning**: All 7 prompts have it (3 abbreviated, 4 full — acceptable since `--setting-sources local` is now in runner)
  7. ✅ **Supabase patterns**: All use correct column names (`name` not `campaign_name`)
  8. ⚠️ **Pixel ID divergence from global project MEMORY.md**: Agent uses `879345548404130`, but global project MEMORY.md (outside agent/) lists `1553637492361321` (purchase optimization) + `918875103967661` (sienna, created Feb 25). Agent context is self-consistent but may be stale if Jaime changed the active pixel. **Need Jaime to clarify.**
  9. ⚠️ **reporting-agent.txt missing TM data caveat**: Queries `tickets_available` and `gross` but doesn't warn they're null for most events → **FIXED: added data limitation note**
  10. ⚠️ **tm-agent.txt UUOC**: Used `cat .env | grep` instead of `grep X .env` → **FIXED: removed useless cat**
- **Prompt quality assessment:**
  - **boss.txt**: Excellent. Clear COO role, activity log system, team routing table, Discord REST API, self-improvement via skills/. Well-structured.
  - **media-buyer.txt**: Excellent. Comprehensive read+write operations, safety guardrails (budget min/max, no DELETE, confirmation for activations), marginal ROAS framework, $0 spend diagnosis checklist. Best prompt of the set.
  - **client-manager.txt**: Good. Onboarding checklist is actionable. Budget tracking section needs Supabase `like` syntax (`*Zamora*` should be `%25Zamora%25` URL-encoded, or use PostgREST `ilike`). Not fixing this cycle — minor.
  - **creative-agent.txt**: Good. Creative specs are accurate (4:5, 9:16, text limits). Fatigue detection framework solid. Read-only stance (directs to #media-buyer for changes) is correct.
  - **reporting-agent.txt**: Good. Report templates are actionable. Cross-source matching documented. Fixed TM data caveat.
  - **tm-agent.txt**: Excellent. All 26 surrogate IDs documented. Demographics endpoint, zip code scraping, ingest payloads all correct. Fixed UUOC.
- **Business observations (from Supabase query during .env verification):**
  - 🟢 **Houston NOW SPENDING**: $242.55 spend (up from $0), but **0.00 ROAS** (0 purchases). Feb 25 snapshot captured $0 (before spending started). At $400/day, $242 is ~14 hours of spend. 0 purchases on $242 spend is approaching watch territory but not yet at $50 kill threshold per media-buyer.txt strategy.
  - 🟡 **KYBBA budget doubled**: Was $50/day (5000 cents), now $100/day (10000 cents). Intentional by Jaime — not flagging.
  - 🟢 **KYBBA ROAS 2.43×** (live) — still above 2.0 but down from 2.47× (Feb 25 snapshot). Decline continues.
  - 🟢 **Camila Sacramento improving**: 4.85× ROAS (live) vs 4.42× (Feb 25 snapshot). Positive trend.
  - 🟢 **Alofoke strong**: 8.53× ROAS, $551 spend. Boston Mar 2 (5 days out). On track.
- **Files changed this cycle:**
  - `prompts/reporting-agent.txt`: Added TM data limitation note (tickets_available/gross may be null)
  - `prompts/tm-agent.txt`: Replaced `cat .env | grep` with `grep X .env` for consistency
  - `LEARNINGS.md`: This entry
- **No Telegram draft** — No critical findings. Houston spending is good news. Pixel ID question is for next in-person check.
- **Next priority:** P3 — Memory Maintenance (MEMORY.md needs updates for new architecture: Discord integration, new prompt file inventory, updated campaign state). Or P4 — full monitoring cycle now that .env and scheduler are back.

## 2026-02-25 ~23:35 UTC — Cycle #55 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (rotation-compliant — last was P2 #54. Full monitoring cycle with Supabase queries.)
- **P1 check: ✅ No breakage** — .env present, scheduler alive (heartbeats every minute through 23:30 UTC), Supabase responding.
- **Infrastructure notes:**
  - Session cache files (`last-campaigns.json`, `last-events.json`) do NOT exist post-restructuring. New Discord architecture uses `session/activity-log.json` instead. Monitoring works fine via direct Supabase queries.
  - First Meta sync after scheduler restart was likely at 00:00 UTC Feb 26 (not yet — scheduler restarted ~22:40 UTC Feb 25, so cron at 00:00 UTC is the first scheduled sync).
- **Campaign monitoring results (5 ACTIVE, data from 18:00 UTC sync + live Supabase):**
  1. 🔴 **Houston — STILL $0 ROAS, $242.55 spent** — Critical alert already posted at 20:32 UTC today (by another agent session). At $400/day budget, likely at ~$335-400 total by now. Zero purchases despite 42K impressions and 1,211 clicks (CTR 2.84%). Probable pixel/landing page issue. **No new alert posted — existing critical alert covers it.**
  2. 🟡 **KYBBA — Marginal ROAS worsened to 0.86×** (from 0.95× last cycle). Budget doubled to $100/day. Long-term marginal (Feb 19→live, 6-day span): 0.86×. But recent marginal (Feb 23→live, 2-day span) shows 1.65× — possibly reflecting adset swap effect (V5+Asset1 activated Feb 24). Blended: 2.43× (down from 2.47 snapshot). Projection: blended crosses 2.0 ~Mar 6 at conservative 0.86× rate, or ~Mar 28 at optimistic 1.65× rate. Show date Mar 22. **Post-swap evaluation starts Feb 28.** Alert already posted.
  3. 🟢 **Alofoke — Exceptional: 8.53× live, marginal 13.25×.** $551 spend, $250/day budget. Boston Mar 2 (5 days out). On track. No concerns.
  4. 🟢 **Camila Anaheim — Healthy: 3.11× live, marginal 2.69×.** ROAS dipped from 3.81 (snapshot) to 3.11 (live) — likely intraday attribution lag (per established rule: within-day deltas unreliable). Multi-day marginal is solid.
  5. 🟢 **Camila Sacramento — Strong: 4.85× live, marginal 6.35×.** Improving trend (up from 4.42 snapshot). Best-performing Camila campaign.
- **Pacing analysis:**
  - Anaheim: 77% (6 days elapsed, $463/$600 expected). Normal ramp-up. ✅
  - Sacramento: 75% (6 days elapsed, $452/$600 expected). Normal ramp-up. ✅
  - Houston, KYBBA, Alofoke: pacing skipped (budget changes or pause history — formula unreliable).
- **🟡 EVENT SNAPSHOTS — COMPLETELY STATIC:**
  - All 24 events show **zero ticket delta** across 3 consecutive snapshot dates (Feb 23, 24, 25). Every single `tickets_sold` value is identical.
  - This confirms: event_snapshots pipeline works mechanically (writes rows) but the underlying TM One data source is frozen. The original `tickets_sold` values came from an earlier scraper session when the API briefly worked. Current scraper re-captures the same static values.
  - **Impact:** Event velocity monitoring is impossible until TM One per-event API returns live data. Snapshots are useless for tracking sell-through trends.
  - Not alerting (known TM One limitation, documented in MEMORY.md). But worth noting that the event_snapshots table now has 72 rows (3 dates × 24 events) of identical data — adds no analytical value.
- **ROAS trend analysis (4 snapshot dates: Feb 19, 23, 24, 25):**
  - KYBBA: 2.73 → 2.46 → 2.46 → 2.47. Declining but stabilized. Most recent dip in live data (2.43).
  - Alofoke: 3.67 → 3.66 → 8.72. Massive jump Feb 24→25 = attribution catch-up. Now 8.53 live.
  - Anaheim: 3.42 → 3.41 → 3.81. Feb 24→25 was a good day. Live dipped to 3.11.
  - Sacramento: 3.67 → 3.65 → 4.42. Steady improvement. Now 4.85 live.
  - **Observation:** Feb 23→24 snapshot deltas confirm Meta reporting lag — near-zero spend changes (KYBBA: $0.22, Alofoke: $0.84 on $100-250/day budgets). Feb 24→25 deltas are much larger (KYBBA: $53.60, Alofoke: $92.39) and match expected 1-day spend. This suggests the Feb 23 snapshot was taken before Meta finalized Feb 22's data, while Feb 25 snapshot captured correctly.
- **Alerts status:** 5 alerts in dashboard, none read. Houston critical + KYBBA warning from 20:32 UTC today. No new alerts needed.
- **No Telegram draft** — All critical alerts already posted by earlier session. No new anomalies discovered. KYBBA marginal worsening is incremental, not actionable until post-swap evaluation Feb 28.
- **Next priority:** P3 — Memory Maintenance. MEMORY.md needs updates for: (1) Discord multi-agent architecture (not yet reflected), (2) updated campaign state (Houston spending but 0 ROAS, KYBBA budget doubled), (3) event snapshot staleness finding, (4) session cache file changes (no more last-campaigns.json/last-events.json). Also: clean up LEARNINGS.md condensed history if it's getting too long (currently 55 cycles).
