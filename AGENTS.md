# Outlet Media Agent Bootstrap

This file is a bootstrap pointer for coding agents. The canonical project knowledge base is the LLM-friendly wiki in [`wiki/Home.md`](./wiki/Home.md).

## Required read path

Before product, architecture, database, deployment, or workflow changes:

1. Read [`wiki/Home.md`](./wiki/Home.md).
2. Follow the task-specific read path listed there.
3. Treat `wiki/` as the source of truth if any pointer file disagrees.

## Operating rules

- Preserve user work. Do not overwrite unrelated dirty files.
- Do not put secrets, tokens, credentials, private keys, or private client PII in prompts, docs, commits, logs, or wiki pages.
- Keep shipped product scope aligned with the wiki: Campaigns plus admin account/access management unless explicitly changed.
- Use `src/proxy.ts` for Clerk middleware behavior; there is no `middleware.ts`.
- For app changes, run the lean gate when possible: `npm run type-check`, `npm run lint`, `npm test`, and `npm run build`.
- When the user asks for autonomous delivery, commit and push only relevant changes after verification. After a verified app push, run `railway up --detach`.

## Canonical pages

- Product/current state: [`wiki/Current-State.md`](./wiki/Current-State.md)
- Product scope: [`wiki/Product-Scope.md`](./wiki/Product-Scope.md)
- Engineering rules: [`wiki/Engineering-Principles.md`](./wiki/Engineering-Principles.md)
- Campaigns/Meta ads: [`wiki/Campaigns-And-Meta-Ads.md`](./wiki/Campaigns-And-Meta-Ads.md)
- Data/Supabase: [`wiki/Data-And-Supabase.md`](./wiki/Data-And-Supabase.md)
- Deployment/production: [`wiki/Deployment-And-Production.md`](./wiki/Deployment-And-Production.md)
- AI/Codex workflow: [`wiki/AI-Codex-Workflow.md`](./wiki/AI-Codex-Workflow.md)
