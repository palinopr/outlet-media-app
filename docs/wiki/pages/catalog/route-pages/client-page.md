# /client

Generated from the current working tree on 2026-04-10 22:05:59.

- Route file: `src/app/client/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Methods: none
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect()
- Direct internal imports: src/components/ui/button.tsx, src/features/client-portal/entry.ts
- Feature modules touched: client-portal
- Shared libs/runtime touched: src/lib/utils.ts, src/lib/supabase.ts, src/lib/member-access.ts
- Database objects touched: clients, client_members, client_access_invites, client_member_campaigns, client_member_events
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js page for `/client`; exports: ClientPickerPage, default; internal imports: 2; package imports: 6

## Stack by group
- src/components / ui: src/components/ui/button.tsx
- src/features / client-portal: src/features/client-portal/entry.ts
- src/lib: src/lib/utils.ts, src/lib/supabase.ts, src/lib/member-access.ts
