# /admin/events/[eventId]

Generated from the current working tree on 2026-04-10 15:42:38.

- Route file: `src/app/admin/events/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: calls notFound()
- Direct internal imports: src/components/admin/page-header.tsx, src/components/admin/stat-card.tsx, src/components/admin/events/event-operating-panel.tsx, src/features/events/server.ts, src/lib/formatters.tsx
- Feature modules touched: events, system-events, invitations, workflow
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts
- Database objects touched: clients, tm_events, meta_campaigns, event_comments, event_follow_up_items, client_members, client_member_campaigns, client_member_events, campaign_client_overrides, system_events, admin_activity
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js page for `/admin/events/[eventId]`; exports: AdminEventDetailPage, default; internal imports: 5; package imports: 3

## Stack by group
- src/app / admin: src/app/admin/actions/events.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/page-header.tsx, src/components/admin/stat-card.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/inline-edit.tsx, src/components/admin/status-select.tsx, src/components/admin/events/event-cells.tsx
- src/components / ui: src/components/ui/card.tsx
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts
