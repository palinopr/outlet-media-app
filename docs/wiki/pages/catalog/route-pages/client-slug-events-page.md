# /client/[slug]/events

Generated from the current working tree on 2026-04-10 16:52:39.

- Route file: `src/app/client/[slug]/events/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Methods: none
- Auth signals: none
- Behavior signals: defines generateMetadata
- Direct internal imports: src/app/client/[slug]/data.ts, src/lib/formatters.tsx, src/app/client/[slug]/events/events-filter.tsx, src/features/client-portal/access.ts
- Feature modules touched: client-portal, invitations
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/client-slug.ts
- Database objects touched: tm_events, tm_event_demographics, meta_campaigns, clients, client_members, client_member_campaigns, client_member_events, client_access_invites, campaign_client_overrides, leads
- Direct tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/events`; exports: ClientEventsPage, generateMetadata, default; internal imports: 4; package imports: 3

## Stack by group
- src/app / client: src/app/client/[slug]/data.ts, src/app/client/[slug]/events/events-filter.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/event-card.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/progress-bar.tsx
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/types.ts, src/features/client-portal/insights.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/client-slug.ts
