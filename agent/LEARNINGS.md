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
