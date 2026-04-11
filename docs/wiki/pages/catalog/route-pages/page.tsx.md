# /

Generated from the current working tree on 2026-04-10 21:59:58.

- Route file: `src/app/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Methods: none
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect()
- Direct internal imports: src/features/client-portal/entry.ts
- Feature modules touched: client-portal
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/member-access.ts
- Database objects touched: clients, client_members, client_access_invites, client_member_campaigns, client_member_events
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js page for `/`; exports: RootPage, default; internal imports: 1; package imports: 2

## Stack by group
- src/features / client-portal: src/features/client-portal/entry.ts
- src/lib: src/lib/supabase.ts, src/lib/member-access.ts
