# /client/[slug]

Generated from the current working tree on 2026-04-10 17:55:29.

- Route file: `src/app/client/[slug]/layout.tsx`
- Type: Next.js layout
- Ownership: web client route surface
- Methods: none
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect(), defines generateMetadata
- Direct internal imports: src/lib/formatters.tsx, src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/features/client-portal/theme.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- Feature modules touched: client-portal, invitations
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/utils.ts
- Database objects touched: clients, client_members, client_access_invites, client_member_campaigns, client_member_events
- Direct tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js layout for `/client/[slug]`; exports: ClientLayout, generateMetadata, default; internal imports: 7; package imports: 5

## Stack by group
- src/app / client: src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/app/client/[slug]/components/nav-config.ts
- src/components / ui: src/components/ui/dialog.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx
- src/features / client-portal: src/features/client-portal/theme.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/utils.ts
