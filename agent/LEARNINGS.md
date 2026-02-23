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

## 2026-02-23 — Manual Targeting + Ad Fix (Zip Code Buyer Data Response)

**Trigger:** Buyer analysis showed 297 sales from SF Bay Area zip codes (top: 94509 Antioch) and geographic spread beyond existing 25-mile radii for both Sacramento and Anaheim.

**Change 1 — Sacramento radius expanded 25 → 50 miles**
- Campaign: Zamora - Camila - Sacramento (120242224072890525)
- All 6 adsets updated: Sacramento Memorial Auditorium (key: 150784128281218, lat: 38.57883, lon: -121.48564)
- Adsets: 120242301799720525, 120242301776810525, 120242301748660525, 120242301730720525, 120242301722110525, 120242224072910525

**Change 2 — New Bay Area adset created**
- New adset ID: 120242461121430525 (Camila - Sacramento - Bay Area)
- Campaign: Zamora - Camila - Sacramento (120242224072890525), CBO $100/day
- Targeting: custom_location 40-mile radius around Oakland (37.8044, -122.2712) covers East Bay, Antioch, South Bay
- Billing/optimization: IMPRESSIONS / OFFSITE_CONVERSIONS (PURCHASE pixel 1553637492361321)
- Note: Meta API normalized `targeting_automation.individual_setting` field out — expected, advantage_audience:1 retained

**Change 3 — Anaheim radius expanded 25 → 40 miles**
- Campaign: Camila - Anaheim (120242223986010525)
- All 6 adsets updated: Honda Center (key: 12827521764, lat: 33.807297552665, lon: -117.87627216295)
- Adsets: 120242301010780525, 120242300998520525, 120242300990090525, 120242300973180525, 120242300765120525, 120242223985990525

**Change 4 — Fixed 191x100 deprecated crop key on 3 ads**
- Error code 2490085 (HARD_ERROR): blocks delivery silently. Ad shows `effective_status=WITH_ISSUES`.
- Root cause: `asset_feed_spec.images` had an entry with `"image_crops": {"191x100": ...}` — Meta deprecated this crop key.
- Affected ads (all PAUSED after fix):
  - Sacramento asset 2 (120242461398060525 = new replacement, ACTIVE)
  - Anaheim-2 asset 2 (120242461665940525 = new replacement, ACTIVE)
  - Anaheim original asset 1 (120242461670630525 = new replacement, ACTIVE)
- **Fix procedure (documented in command.txt "Ad Delivery Error Fixing" section)**

**API notes learned:**
- Adset POST updates: `-F` multipart form data (existing adset)
- Adset CREATE: `--data-urlencode` form encoding to `act_{ID}/adsets` (NOT `/copies` — returns 404)
- CBO campaigns: adsets have no `daily_budget` — budget controlled at campaign level
- New creative creation: NEVER reuse old adlabel names — they belong to the old creative, cause conflicts
- Duplicate hash rejection: Meta rejects asset_feed_spec with two images sharing the same hash, even if one had a crop. Drop the duplicate entry instead of stripping the crop.
- Meta Ads Manager UI lags on bulk targeting changes — only 1-2 adsets show "recently edited" badge, but API confirms all were updated. Trust the API.

## 2026-02-23 ~14:30 CST — Cycle #30 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (per rotation: last was P3 Cycle #29)
- **What I audited or read:**
  - LEARNINGS.md (full read), MEMORY.md (full read)
  - Session cache: last-campaigns.json mtime 12:02 CST (18:02 UTC, ~7.5h old). last-events.json same mtime.
  - Supabase: campaign_snapshots (30 rows across Feb 19 + Feb 23), agent_jobs heartbeats (alive at 20:30 UTC)
  - Endpoints: ingest 401 ✅, alerts 401 ✅ (no Clerk regression)
  - TM scraper files: tm-monitor-stderr.log from 14:08 Feb 23, no new errors
- **P1 check:** No breakage. Scheduler alive. Endpoints healthy. No errors.
- **Campaign status:** 4 ACTIVE (Alofoke, Camila Sac, Camila Ana, KYBBA), 12 PAUSED in session cache. No changes since Cycle #27.
- **ROAS check (ACTIVE):**
  - Alofoke: 3.66× ✅ — healthy
  - Camila Sacramento: 3.65× ✅ — healthy
  - Camila Anaheim: 3.41× ✅ — healthy
  - KYBBA: 2.46× ⚠️ — above 2.0 threshold but declining
- **Pacing check (ACTIVE):**
  - Alofoke: $272 / $400 expected (4 days × $100/day) = 0.68 — at underpacing threshold. Normal for 4-day ramp-up.
  - Camila Sac: $255 / $400 = 0.64 — slightly under. Normal ramp-up.
  - Camila Ana: $269 / $400 = 0.67 — slightly under. Normal ramp-up.
  - KYBBA: SKIP (extensive pause history Dec-Feb, raw pacing meaningless)
- **Marginal ROAS (Feb 19→Feb 23 snapshots):**
  - **KYBBA: marginal ROAS = 0.61×** — CONFIRMING Cycle #25 finding. Δspend=$300.09, Δrevenue=$183.76. Losing money on incremental spend.
  - **Updated projection: blended ROAS crosses 2.0 ~Mar 3** (was ~Feb 28 in Cycle #25). Calculation: additional_spend = (5831.92 - 2.0 × 2369.27) / (2.0 - 0.612) = $788. At $100/day = 7.9 days past Feb 23. Show date Mar 22 — ~19 days of sub-2.0 spending if marginal ROAS holds.
  - Caveat: 4-day snapshot gap (Feb 19→23) makes marginal ROAS noisy. Feb 24 snapshot will give first consecutive daily data.
  - New campaigns (Alofoke, Camila) have no Feb 19 snapshot — marginal ROAS calculation needs Feb 24+ snapshot.
- **PAUSED campaign attribution shifts (interesting, not actionable):**
  - Portland V2: ROAS 7.88→9.21 (delayed attribution on existing spend while paused) ✅
  - Others: minimal change
  - Happy Paws: spend dropped 40000→33963 cents ($400→$339.63) — Meta attribution reversal. PAUSED, null ROAS. Not actionable.
- **TM Events:** 25 events unchanged. Seattle (Feb 25, 2 days out) + Portland (Feb 26, 3 days out) — campaigns PAUSED, flagged previously as likely intentional. No status changes.
- **New finding from manual session:** Ad delivery error 2490085 (deprecated 191x100 crop key) was found and fixed on 3 ads. Fix documented in command.txt. This is a real operational finding — deprecated Meta creative format was silently blocking ad delivery.
- **Action taken:**
  1. Updated KYBBA projection in MEMORY.md: ~Feb 28 → ~Mar 3
  2. Noted: targeting changes from manual session (radius expansions, new Bay Area adset) should improve Camila Sac/Ana delivery — watch for spend velocity increase in Feb 24 snapshot
- **No Telegram draft** — KYBBA finding already flagged Cycle #25. Projection improved slightly (Mar 3 vs Feb 28). No new business anomaly.
- **Next priority:** P2 — Prompt Audit. All 3 prompts completed 2 audit cycles but manual session revealed new patterns (ad delivery error fixing, adset creation, creative management) that should be documented in prompts. Alternatively P6 if overdue. Avoid P4 next per rotation.

## 2026-02-23 ~15:00 CST — Cycle #31 (Prompt Audit — command.txt + chat.txt)
- **Priority chosen:** P2 — Prompt Audit (per Cycle #30 recommendation — manual session revealed undocumented adset/targeting patterns)
- **P1 check:** No breakage. Scheduler alive (heartbeat 21:00 UTC). Session cache from 18:02 UTC (on schedule). No error files.
- **What I audited or read:**
  - LEARNINGS.md (full read — manual session entry with API notes)
  - MEMORY.md (full read — verified campaign state, ad delivery error docs)
  - command.txt (555 lines pre-edit)
  - chat.txt (324 lines pre-edit)
- **Action taken:**
  1. **command.txt: Added "Adset & Targeting Operations" section** (lines 139-190, +53 lines → 608 total). Covers: list adsets, read targeting, update targeting (multipart `-F`), create new adset (`--data-urlencode` to `act_{ID}/adsets`), CBO campaign note (no daily_budget on adsets), bulk targeting update workflow, Meta API normalization behavior.
  2. **chat.txt: Added targeting update + adset creation patterns** (+24 lines → 348 total). Added: `targeting` field to adset list query, targeting update via `-F` multipart form, new adset creation endpoint (not via copies), CBO budget note.
  3. **Cross-check:** Pixel ID (879345548404130), ad account (act_787610255314938), API version (v21.0) all consistent across both files. think.txt not touched (targeting ops aren't part of think loop).
- **Gaps addressed from manual session:**
  - ✅ Adset targeting updates (radius expansion) — was undocumented
  - ✅ Adset creation (fresh, not copies) — was undocumented
  - ✅ CBO campaign behavior (no daily_budget on adsets) — was undocumented
  - ✅ Bulk targeting workflow — was undocumented
  - ✅ Meta normalization of targeting_automation — was undocumented
  - Already documented: ad delivery error fixing (2490085), creative label naming, duplicate hash rejection
- **No Telegram draft** — routine prompt improvement, no business anomaly.
- **Next priority:** P4 — Business Monitoring. Feb 24 00:00 UTC sync should have fired (6pm CST Feb 23), bringing the 3rd snapshot date. First chance to check: (1) KYBBA marginal ROAS with consecutive days, (2) new campaigns' first marginal ROAS, (3) whether targeting changes improved Camila Sac/Ana delivery. Alternatively P6 if infra check overdue. Avoid P2 next per rotation.

## 2026-02-23 ~15:30 CST — Cycle #32 (Business Monitoring)
- **Priority chosen:** P4 — Business Monitoring (per Cycle #31 recommendation, rotation-compliant — last was P2)
- **P1 check:** No breakage. Scheduler alive (heartbeat 21:30 UTC). Endpoints healthy (ingest 401 ✅, alerts 401 ✅). No error files.
- **What I audited or read:**
  - LEARNINGS.md (full read), MEMORY.md (full read, verified accurate — 4 ACTIVE, 13 PAUSED ✅)
  - Session cache: last-campaigns.json mtime 12:02 CST (18:02 UTC, ~3.5h old) — fresh
  - Supabase: campaign_snapshots (still 2 dates: Feb 19 + Feb 23, 30 rows total), agent_jobs heartbeats (alive)
  - Supabase: Beamina V3 (120219401679220525) confirmed PAUSED — not in session cache, correct
  - Endpoints: ingest 401 ✅, alerts 401 ✅ (no Clerk regression)
  - TM scraper files: unchanged since Cycle #30
- **Campaign status:** 4 ACTIVE (Alofoke, Camila Sac, Camila Ana, KYBBA), 13 PAUSED. **No status changes since Cycle #30.**
- **ROAS check (ACTIVE):**
  - Alofoke: 3.66× ✅ — healthy
  - Camila Sacramento: 3.65× ✅ — healthy
  - Camila Anaheim: 3.41× ✅ — healthy
  - KYBBA: 2.46× ⚠️ — above 2.0 but declining (marginal 0.61×, unchanged from Cycle #30)
- **Pacing check (ACTIVE, same as Cycle #30):**
  - Alofoke: $272 / $400 = 0.68, Camila Sac: $255 / $400 = 0.64, Camila Ana: $269 / $400 = 0.67 — all normal ramp-up
  - KYBBA: SKIP (pause history)
- **Marginal ROAS:** Same snapshot dates (Feb 19 + Feb 23) — KYBBA marginal 0.61× unchanged. New campaigns still have only 1 snapshot date (no Feb 19 baseline). **No new calculations possible until Feb 24 snapshot.**
- **Key observation:** This cycle's data is identical to Cycle #30. The Feb 24 snapshot (06:00 UTC = midnight CST tonight) will be the first genuinely new data point — enabling: (1) KYBBA marginal ROAS from consecutive days (Feb 23→24), (2) first marginal ROAS for Alofoke/Camila campaigns, (3) first signal of targeting change impact (radius expansions + Bay Area adset).
- **Action taken:** None — no new data, no anomalies, MEMORY.md already accurate.
- **No Telegram draft** — no new findings since Cycle #30.
- **Next priority:** P6 — Infrastructure Check. Last P6 was Cycle #23 (9 cycles ago — most overdue priority). After that, P4 on Feb 24 will be the highest-impact monitoring cycle (3rd snapshot date). Avoid P4 next per rotation.

## 2026-02-23 ~17:00 CST — Cycle #34 (Knowledge Expansion)
- **Priority chosen:** P5 — Knowledge Expansion (most overdue — 5 cycles since #28, rotation-compliant — last was P6)
- **P1 check:** No breakage. Scheduler alive (heartbeat 23:00 UTC). Endpoints healthy. No error files. Session cache: campaigns 18:02 UTC, events 22:08 UTC. ✅
- **What I audited or read:**
  - LEARNINGS.md (full read — 302 lines, Cycles #0-33)
  - MEMORY.md (full read — 160 lines, verified accurate)
  - session/proposals.md (179 lines, 6 proposals A-F from Cycle #28)
  - session/last-campaigns.json (16 campaigns, 4 ACTIVE)
  - session/last-events.json (25 events, scraped 22:07 UTC — fresh from 22:00 TM cron)
  - Manual session notes in LEARNINGS.md (targeting changes, ad error fixing, zip code analysis)
- **Key insight:** The Feb 23 manual session revealed two major automation gaps that the existing proposals didn't cover:
  1. **Silent ad delivery failures** — 3 ads blocked by deprecated 191x100 crop key (error 2490085). No alert was generated. Agent syncs campaigns but never checks ad-level health. Each blocked ad = wasted CBO budget allocation.
  2. **No post-show reporting** — Denver show passed Feb 18 with 9.82× ROAS ($2,240 spent, ~$22K revenue). No automated summary was generated for client reporting or internal learning loop.
- **Action taken:**
  1. **Added Proposal G: Automated Ad Health Scan** — After each Meta sync, query `effective_status=WITH_ISSUES` ads. Alert immediately via dashboard + Telegram. Very small effort (single API call). Ranked #1 — prevents active budget waste, proven need.
  2. **Added Proposal H: Post-Show Performance Report** — Auto-generate campaign summary after show date passes. Total spend, ROAS curve, targeting strategy, learnings. Medium effort. Ranked #6.
  3. **Updated priority ranking** — G and D now top (both very-small-effort, high ROI). A remains highest strategic value. Full ranking: G→D→A→C→B→H→E→F.
  4. **Updated state summary** in proposals.md — 4 ACTIVE (not 5), noted command-mode capabilities, added manual session learnings context.
- **No Telegram draft** — proposals are for Jaime's review when he's ready, not time-sensitive alerts.
- **Next priority:** P4 — Business Monitoring. The 00:00 UTC sync (6PM CST tonight) will refresh session cache with any intraday spend changes. More importantly, the Feb 24 snapshot at 06:00 UTC (midnight CST) enables: (1) KYBBA marginal ROAS from consecutive days (Feb 23→24), (2) first marginal ROAS for Alofoke/Camila campaigns, (3) first signal of targeting change impact. First P4 on Feb 24 will be the highest-impact monitoring cycle of the week. Avoid P5 next per rotation.

## 2026-02-23 ~16:30 CST — Cycle #33 (Infrastructure Check)
- **Priority chosen:** P6 — Infrastructure Check (per Cycle #32 recommendation, last P6 was Cycle #23 — 10 cycles ago, most overdue)
- **P1 check:** No breakage. Scheduler alive (heartbeat 22:30 UTC, every minute). No error files.
- **What I audited or read:**
  - LEARNINGS.md (full read), MEMORY.md (full read)
  - .env: all 7 vars present (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INGEST_URL, INGEST_SECRET, TELEGRAM_BOT_TOKEN, TM_EMAIL, TM_PASSWORD) ✅
  - Claude CLI: v2.1.50 at `/Users/jaimeortiz/.local/bin/claude` ✅
  - Endpoints: `/api/health` → 404 (expected), `/api/ingest` POST → 401 ✅, `/api/alerts` POST → 401 ✅ (no Clerk 307 regression)
  - Scheduler: running in tmux "agent" session (PID 66704, started ~19:09 CST). Heartbeats every minute. ✅
  - Session cache: last-campaigns.json 18:02 UTC (matches 18:00 Meta cron ✅), last-events.json 22:08 UTC (matches 22:00 TM cron ✅)
  - Campaign snapshots: 30 rows, 2 dates (Feb 19 + Feb 23). Feb 24 expected at 06:00 UTC.
  - Supabase meta_campaigns: 4 ACTIVE updated at 18:02 UTC (confirms 18:00 sync). PAUSED at 12:04 (manual run, expected).
  - Non-heartbeat jobs: last was `tm-demographics` at 01:10 UTC Feb 23. Old Feb 18 jobs still in table.
  - TM scraper stderr: all per-event API calls still returning "empty" (Known Issue #4 unchanged). 25 events via GraphQL. ✅
- **New verification:** TM cron independently confirmed — last-events.json mtime 22:08 UTC matches 22:00 even-hour cron slot. Previous cycles only verified Meta cron timing.
- **Full status summary — ALL GREEN:**
  | Check | Status |
  |-------|--------|
  | INGEST_URL | ✅ Railway production |
  | /api/ingest | ✅ 401 (alive) |
  | /api/alerts | ✅ 401 (no Clerk regression) |
  | .env (7 vars) | ✅ All present |
  | Claude CLI | ✅ v2.1.50 |
  | Heartbeats | ✅ Every minute |
  | Scheduler PID | ✅ tmux "agent" session |
  | Meta cron (18:00 UTC) | ✅ Confirmed by file mtime + Supabase |
  | TM cron (22:00 UTC) | ✅ Confirmed by file mtime |
  | Snapshots | ✅ 30 rows, Feb 24 pending |
  | Supabase | ✅ Responsive |
- **Action taken:** None — everything operational. Logged verification of TM cron timing (new).
- **No Telegram draft** — all infrastructure healthy, no anomalies.
- **Next priority:** P4 — Business Monitoring. **Feb 24 is the most important monitoring cycle yet.** The 06:00 UTC (midnight CST) sync creates Feb 24 snapshots, enabling: (1) KYBBA marginal ROAS from consecutive days (Feb 23→24), (2) first marginal ROAS for Alofoke/Camila (their Feb 23 snapshots + Feb 24 = 2 points), (3) first signal of targeting change impact (radius expansions + Bay Area adset from today's manual session). The 00:00 UTC sync (6PM CST tonight) refreshes session cache first. Alternatively P2/P3/P5 if P4 seems premature before snapshots land. Avoid P6 next per rotation.

## 2026-02-23 ~19:00 CST — Manual KYBBA Deep Dive (Jaime + customer request)

**Trigger:** KYBBA customer asked how the campaign is doing.

**Campaign-level summary (last 30d):**
- Spend: $2,369 | Revenue: $5,832 | ROAS: 2.46× | Purchases: 50 | CPA: $47.39
- Checkouts: 520 → Purchases: 50 = **9.6% checkout conversion** (90% abandonment)
- CTR: 2.10% | CPM: $9.36 | CPC: $0.45 | Reach: 61,216 | Impressions: 253,234
- Daily budget: $50/day | Show: Mar 22 (27 days out)

**Trend:** Blended ROAS declining (2.73× Feb 19 → 2.46× Feb 23). Marginal ROAS 0.61× confirmed.

**Ad set breakdown (5 active):**
| Ad Set | Spend | Purchases | ROAS | CPA |
|--------|-------|-----------|------|-----|
| Video 12 (B) | $86 | 4 | 4.65× | $21.56 |
| Video 12 (A) | $89 | 3 | 3.96× | $29.77 |
| Video 11 | $894 | 24 | 3.32× | $37.24 |
| Video 9 | $108 | 2 | 2.82× | $54.10 |
| Video 1 | $175 | 4 | 2.67× | $43.77 |
Paused ad sets (Videos 2-8, Assets 1-2): ~$1,017 for 13 purchases ($78 CPA)

**Recommendations given to Jaime:**
1. Kill Video 9 ($54 CPA) and Video 1 ($44 CPA) — dragging blended ROAS
2. Scale Video 12 — best performer (4.65× and 3.96× ROAS)
3. Video 11 is fatiguing (67% of budget, $37 CPA) — monitor, pause if <3×
4. Checkout drop-off 520→50 (9.6%) is a landing page / ticketing UX problem
5. Fresh creatives needed (Video 13/14) — urgency/FOMO angles with 27 days to show
6. Test tighter age band (21-45) — all ad sets wide open 18-65 with Advantage+

**Budget question:** Customer asked about increasing to $50 per ad set (from $50 total campaign). Analysis pending — see next entry.
