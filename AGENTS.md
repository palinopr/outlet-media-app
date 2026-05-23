# Outlet Media Agent Bootstrap

This file is a bootstrap pointer for coding agents. The canonical durable project memory is the Obsidian v2 LLM-wiki / knowledge graph:

```text
/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2
```

The local app repo `wiki/` directory is deprecated and intentionally removed. Do not recreate it unless Jaime explicitly reverses that decision.

## Required read path

Before product, architecture, database, deployment, or workflow changes:

1. Read the Obsidian v2 bootstrap at `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2/AGENTS.md`.
2. Read `00 Start Here.md`, `01 Indexes/Global Index.md`, `10 Doctrine/Agent Memory Protocol.md`, and `90 System/Outlet App Wiki Pointer.md` in that vault.
3. Follow the relevant v2 doctrine/client/source path for the task.
4. Verify current behavior against this repo's code, migrations, tests, and live source systems as needed.

## Operating rules

- Preserve user work. Do not overwrite unrelated dirty files.
- Do not put secrets, tokens, credentials, private keys, or private client PII in prompts, docs, commits, logs, or Obsidian pages.
- Keep shipped product scope aligned with v2 memory: Campaigns plus admin account/access management unless explicitly changed.
- Use `src/proxy.ts` for Clerk middleware behavior; there is no `middleware.ts`.
- For app changes, run the lean gate when possible: `npm run type-check`, `npm run lint`, `npm test`, and `npm run build`.
- When the user asks for autonomous delivery, commit and push only relevant changes after verification. After a verified app push, run `railway up --detach`.
- Write durable product/engineering/ops lessons back to Obsidian v2, not to a local repo wiki.

## Canonical v2 pages

- App memory pointer: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2/90 System/Outlet App Wiki Pointer.md`
- Agent memory protocol: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2/10 Doctrine/Agent Memory Protocol.md`
- Campaign/Meta doctrine: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2/10 Doctrine/Meta Ads Optimization Protocol.md`
- Attribution/CAPI doctrine: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2/10 Doctrine/Ticketmaster CAPI Bridge Runbook.md`
- Client pages: `/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2/30 Clients/`
