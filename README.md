# Outlet Media App

Client-facing agency operating system focused on campaign performance, client access, and admin operations.

## Stack

- **Frontend/API**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Auth**: Clerk
- **Database**: Supabase PostgreSQL
- **Deploy**: Railway

## Canonical knowledge

The single source of truth is the LLM-friendly Markdown wiki:

- [wiki/Home.md](./wiki/Home.md)

Use the wiki for product scope, architecture, runbooks, Meta ads guidance, Supabase safety, deployment, and Codex/AI workflow. Repo files outside `wiki/` should stay as short pointers or operational bootstraps only.

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
