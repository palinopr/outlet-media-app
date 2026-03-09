# Supabase

- Make durable schema changes through migrations, not dashboard-only edits.
- Public app tables should ship with RLS enabled and explicit policies. Do not leave exposed tables without policies.
- Keep Outlet data conventions intact: money in cents, Meta `spend` converted from dollars, `daily_budget` already in cents, and ROAS as a float.
- Preserve the shared product backbone: `system_events` for the client-visible timeline, `approval_requests` for explicit decisions, and `admin_activity` for internal audit only.
- Schema and policy changes should support shared admin and client visibility and future agent automation instead of one-off route behavior.
