# Outlet Media App

Client-facing agency operating system focused on campaign performance, client access, and admin operations.

## Stack

- **Frontend/API**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Auth**: Clerk
- **Database**: Supabase PostgreSQL
- **Deploy**: Railway

## Canonical knowledge

The single source of truth is the Obsidian v2 LLM-wiki / knowledge graph:

```text
/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2
```

Use Obsidian v2 for product scope, architecture, runbooks, Meta ads guidance, Supabase safety, deployment, and Codex/AI workflow. This repo intentionally does not carry a local `wiki/` folder anymore; repo Markdown should stay as short pointers or operational bootstraps only.

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the required variables. Never commit secrets.

## Quality gate

```bash
npm run check
```

## Deploy

Railway does not auto-deploy from git push:

```bash
git push
railway up --detach
```
