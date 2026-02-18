# Project Status

**Last Updated**: 2026-02-18
**Current Phase**: Build green - ready to wire real data sources
**Repo**: `palinopr/outlet-media-app` (private)

---

## Platform Summary

Autonomous ad agency platform for Outlet Media managing ads for Zamora (music promoter).

| Side | Users | Purpose |
|------|-------|---------|
| Admin | Outlet Media team | Manage AI agents, run ads, monitor campaigns |
| Client | Zamora | View campaign numbers, TM1 numbers, promoter dashboard |

**Tech Stack**: Next.js 16.1.6 + TypeScript strict + Tailwind v4 + shadcn/ui + Clerk auth + Supabase

---

## Build Status

**Build**: PASSING - `npm run build` - 0 TypeScript errors, 14 routes

```
/ → redirects to /admin/dashboard
/sign-in /sign-up → Clerk auth (force-dynamic)
/admin/dashboard /campaigns /events /agents → Admin views
/api/ingest /api/agents /api/meta /api/ticketmaster → API routes
/client/[slug] /client/[slug]/campaigns → Client portal
```

---

## What's Done

- [x] Git repo + commits pushed to `palinopr/outlet-media-app`
- [x] Clean template pushed to `palinopr/claude-agent-template` (public)
- [x] AGENTS.md fully written (OpenCode only, session handoff, AI team config)
- [x] .gitignore, .mcp.json.example, opencode.json.example, .env.example
- [x] 4 domain agents: tech-lead-orchestrator, nextjs-expert, ticketmaster-scraper, meta-ads-manager
- [x] Next.js 16.1.6 scaffold with 14 routes
- [x] shadcn/ui: Card, Button, Badge, Table, Separator, Avatar, Skeleton, Sidebar, Dropdown, Tooltip, Input, Sheet, NavigationMenu
- [x] Clerk auth - proxy.ts middleware protecting all routes
- [x] Supabase client (conditional on env vars, build works without them)
- [x] `src/lib/database.types.ts` - full TypeScript types for tm_events, meta_campaigns
- [x] `supabase/schema.sql` - SQL ready to paste into Supabase dashboard
- [x] `POST /api/ingest` - receives scraper data, upserts to Supabase tm_events
- [x] Local scraper scaffold in `scraper/` (needs `npm install`)
- [x] Build passing with 0 TypeScript errors (fixed Supabase v2 generic bug in admin client)

---

## Next Steps (Priority Order)

### 1. External services setup (blocking everything else)
- [ ] Create Supabase project at supabase.com, run `supabase/schema.sql`
- [ ] Create Clerk project at dashboard.clerk.com, get publishable + secret keys
- [ ] Create `.env.local` from `.env.example`, fill in all keys

### 2. Run scraper for first time
```bash
cd scraper && npm install && npx playwright install chromium
cp .env.example .env
# Fill in: TM_USERNAME, TM_PASSWORD, INGEST_URL, INGEST_SECRET
npm run login    # opens browser, logs into TM One, saves session
npm run scrape   # scrapes events, POSTs to /api/ingest
```

### 3. Wire Meta API
- [ ] Get Meta access token from Meta for Developers
- [ ] Set META_ACCESS_TOKEN + META_AD_ACCOUNT_ID in .env.local
- [ ] Wire /admin/campaigns to fetch real campaign data via /api/meta

### 4. Build out real dashboard
- [ ] Add Recharts or Tremor for spend/impressions/ROAS charts in /admin/dashboard
- [ ] Make agent "Run" buttons in /admin/agents call /api/agents endpoint

### 5. Client portal
- [ ] Decide on client slug for Zamora (e.g. `zamora`)
- [ ] Wire /client/zamora with real Supabase data

### 6. Deploy
- [ ] Push to Vercel, set all env vars in Vercel dashboard

---

## Known Issues / Quirks

- Workspace root warning from Next.js (two package-lock.json files) - non-blocking
- Scraper selectors in `scraper/src/scrape-events.ts` are estimates - verify against actual TM One DOM with `HEADLESS=false`
- `/admin/clients` is in the nav but page does not exist yet
- `supabaseAdmin` in `src/lib/supabase.ts` has no Database generic - Supabase v2 resolves Insert types as `never` when using circular Omit definitions. Types are handled manually at each call site.

---

## Key Files

| File | Notes |
|------|-------|
| `src/proxy.ts` | Clerk middleware (Next.js 16 renamed middleware to proxy) |
| `src/lib/supabase.ts` | Admin client has no Database generic (Supabase v2 type bug) |
| `src/lib/database.types.ts` | Manual DB types for tm_events, meta_campaigns |
| `supabase/schema.sql` | Paste into Supabase SQL editor |
| `scraper/` | Local Playwright scraper - run on Mac, POSTs to /api/ingest |
| `.env.example` | All required env vars documented |
| `AGENTS.md` | Full OpenCode agent config |
