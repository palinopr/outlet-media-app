# Project Status

**Last Updated**: 2026-02-18
**Current Phase**: Foundation complete - Next.js scaffold running, ready to wire APIs
**Repo**: `palinopr/outlet-media-app` (private)

---

## Current Focus

Setting up the autonomous ad agency platform. Two parallel tracks:

1. **App scaffold** - Next.js 15 + TypeScript + Tailwind, route structure, auth
2. **Agent architecture** - Define AI agents for Ticketmaster scraping, Meta Ads management, campaign monitoring

---

## Completed This Session

- [x] Researched top OpenCode repos (rothnic, maclevison, microrepar, awesome-opencode)
- [x] Rewrote AGENTS.md - OpenCode only, removed all Claude Code refs
- [x] Created .gitignore, .mcp.json.example, opencode.json.example, .env.example
- [x] Pushed to `palinopr/claude-agent-template` (public, clean - no secrets)
- [x] Pushed to `palinopr/outlet-media-app` (private)
- [x] Created STATUS.md
- [x] Created domain-specific agents with YAML frontmatter: tech-lead-orchestrator, nextjs-expert, ticketmaster-scraper, meta-ads-manager
- [x] Scaffolded Next.js 16.1.6 (React 19, TypeScript, Tailwind, App Router, Turbopack)
- [x] Built 12 routes: /, /login, /admin/*, /client/[slug]/*, /api/*
- [x] Build passes with 0 TypeScript errors

---

## Next Steps

1. [ ] Choose auth solution (Clerk recommended for fast setup, or NextAuth)
2. [ ] Add auth middleware to protect /admin/* and /client/[slug]/*
3. [ ] Wire Ticketmaster API - populate /admin/events with real data
4. [ ] Wire Meta API - populate /admin/campaigns with real campaigns
5. [ ] Build real dashboard with charts (Recharts or Tremor)
6. [ ] Add database (Supabase or PlanetScale) for campaign data persistence
7. [ ] Implement agent trigger UI in /admin/agents
8. [ ] Deploy to Vercel

---

## App Architecture

**Platform**: Autonomous ad agency for Outlet Media to sell tours (client: Zamora)

| Side | Users | Purpose |
|------|-------|---------|
| Admin | Outlet Media team | Manage AI agents, run ads autonomously, monitor campaigns |
| Client | Zamora | View campaign numbers, TM1 numbers, promoter dashboard |

**Tech Stack**: Next.js 15 + TypeScript + Tailwind CSS + Shadcn/ui

**External APIs**:
- Ticketmaster API (event data, TM1 numbers)
- Meta Marketing API (Facebook/Instagram ads)

---

## Agent Inventory

| Agent | File | Status |
|-------|------|--------|
| Tech Lead Orchestrator | `.opencode/agents/tech-lead-orchestrator.md` | Created |
| Next.js Expert | `.opencode/agents/nextjs-expert.md` | Created |
| Ticketmaster Scraper | `.opencode/agents/ticketmaster-scraper.md` | Created |
| Meta Ads Manager | `.opencode/agents/meta-ads-manager.md` | Created |
| Code Reviewer | `.opencode/agents/code-reviewer.md` | Existing |
| Software Research Assistant | `.opencode/agents/software-research-assistant.md` | Existing |

---

## Quick Stats

- **Framework**: Next.js 15 (App Router)
- **Auth**: TBD (Clerk or NextAuth)
- **DB**: TBD (Supabase or PlanetScale)
- **Deploy**: TBD (Vercel)
- **Commits**: 1
