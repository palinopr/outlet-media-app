# Project Status

**Last Updated**: 2026-02-18
**Current Phase**: Foundation - scaffolding Next.js app and agent architecture
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
- [x] Created .gitignore, .mcp.json.example
- [x] Created GitHub repos: `palinopr/claude-agent-template` (public), `palinopr/outlet-media-app` (private)
- [x] Created STATUS.md (this file)
- [x] Created domain-specific agents: tech-lead-orchestrator, nextjs-expert, ticketmaster-scraper, meta-ads-manager

---

## Next Steps

1. [ ] Push template to `palinopr/claude-agent-template`
2. [ ] Push app to `palinopr/outlet-media-app`
3. [ ] Run `create-next-app` in this directory
4. [ ] Set up auth (admin vs client roles)
5. [ ] Build admin dashboard skeleton
6. [ ] Build client portal skeleton (Zamora view)
7. [ ] Wire Ticketmaster API connection
8. [ ] Wire Meta API connection

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
