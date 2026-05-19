# Supabase Bootstrap

Canonical data and schema rules live in [`../wiki/Data-And-Supabase.md`](../wiki/Data-And-Supabase.md) and [`../wiki/Engineering-Principles.md`](../wiki/Engineering-Principles.md).

Local database rules:

- Make durable schema changes through forward migrations under `supabase/migrations/`.
- Public app tables should ship with RLS enabled and explicit policies.
- Keep generated DB types aligned after applied schema changes.
- Do not put secrets, dumps, or private data in git or wiki pages.
