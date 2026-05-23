# Supabase Bootstrap

Canonical data and schema rules live in Obsidian v2:

```text
/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory v2/Outlet Media Memory 2
```

Start with `AGENTS.md`, `00 Start Here.md`, `10 Doctrine/Agent Memory Protocol.md`, and `90 System/Outlet App Wiki Pointer.md`, then verify against current migrations and DB types in this repo.

Local database rules:

- Make durable schema changes through forward migrations under `supabase/migrations/`.
- Public app tables should ship with RLS enabled and explicit policies.
- Keep generated DB types aligned after applied schema changes.
- Do not put secrets, dumps, or private data in git or Obsidian pages.
