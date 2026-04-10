# /client/[slug]/reports

Generated from the current working tree on 2026-04-10 16:52:39.

- Route file: `src/app/client/[slug]/reports/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Methods: none
- Auth signals: none
- Behavior signals: defines generateMetadata
- Direct internal imports: src/lib/formatters.tsx, src/features/client-portal/access.ts, src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts
- Feature modules touched: client-portal, reports, invitations, agent-outcomes, dashboard, events, assets, approvals, conversations, system-events
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/member-access.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Database objects touched: tm_events, clients, client_members, client_member_campaigns, client_member_events, client_access_invites, leads, tm_event_demographics, meta_campaigns, agent_tasks, system_events, campaign_action_items, asset_follow_up_items, event_follow_up_items, … (+6 more)
- Direct tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/reports`; exports: ClientReportsPage, generateMetadata, default; internal imports: 4; package imports: 2

## Stack by group
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts
- src/features / conversations: src/features/conversations/server.ts, src/features/conversations/summary.ts
- src/features / dashboard: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / reports: src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts, src/features/reports/summary.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/member-access.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
