# Outlet Media Agent Bootstrap

This file is a bootstrap pointer for coding agents. The canonical durable project memory is the Outlet Media Memory Obsidian LLM-wiki / knowledge graph:

```text
/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory
```

The local app repo `wiki/` directory is deprecated and intentionally removed. Do not recreate it unless Jaime explicitly reverses that decision.

## Required read path

Before product, architecture, database, deployment, or workflow changes:

1. Read the Outlet Media Memory bootstrap at `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory/AGENTS.md`.
2. Read `00 Start Here.md` and `01 Indexes/Global Index.md` in that vault.
3. Read `90 System/Fresh Agent 60 Second Boot.md`, `90 System/Agent Instructions.md`, and `90 System/Agent Brain Runtime Audit.md`.
4. Read `10 Doctrine/Agent Memory Protocol.md` and `90 System/Outlet App Wiki Pointer.md`.
5. Follow the relevant main memory doctrine/client/source path for the task.
6. Verify current behavior against this repo's code, migrations, tests, and live source systems as needed.

## Operating rules

- Preserve user work. Do not overwrite unrelated dirty files.
- Do not put secrets, tokens, credentials, private keys, or private client PII in prompts, docs, commits, logs, or Obsidian pages.
- Keep shipped product scope aligned with main memory: Campaigns plus admin account/access management unless explicitly changed.
- Use `src/proxy.ts` for Clerk middleware behavior; there is no `middleware.ts`.
- For app changes, run the lean gate when possible: `npm run type-check`, `npm run lint`, `npm test`, and `npm run build`.
- When the user asks for autonomous delivery, commit and push only relevant changes after verification. After a verified app push, run `railway up --detach`.
- Write durable product/engineering/ops lessons back to Outlet Media Memory, not to a local repo wiki.

## Canonical main memory pages

- App memory pointer: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory/90 System/Outlet App Wiki Pointer.md`
- Agent memory protocol: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory/10 Doctrine/Agent Memory Protocol.md`
- Campaign/Meta doctrine: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory/10 Doctrine/Meta Ads Optimization Protocol.md`
- Attribution/CAPI doctrine: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory/10 Doctrine/Ticketmaster CAPI Bridge Runbook.md`
- Client pages: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory/30 Clients/`
