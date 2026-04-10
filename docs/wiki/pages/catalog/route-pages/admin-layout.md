# /admin

Generated from the current working tree on 2026-04-10 17:55:29.

- Route file: `src/app/admin/layout.tsx`
- Type: Next.js layout
- Ownership: web admin route surface
- Methods: none
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect(), sets dynamic rendering mode
- Direct internal imports: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts
- Database objects touched: clients, tm_events, meta_campaigns, campaign_client_overrides
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js layout for `/admin`; exports: AdminLayout, dynamic, metadata, default; internal imports: 5; package imports: 5

## Stack by group
- src / hooks: src/hooks/use-sidebar-state.ts
- src/app / admin: src/app/admin/actions/search.ts
- src/components / admin: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx, src/components/admin/sidebar-content.tsx, src/components/admin/nav-config.ts, src/components/admin/nav-links.tsx, src/components/admin/user-avatar.tsx
- src/components / ui: src/components/ui/sheet.tsx, src/components/ui/command.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/dialog.tsx, src/components/ui/tooltip.tsx, src/components/ui/button.tsx
- src/lib: src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts
