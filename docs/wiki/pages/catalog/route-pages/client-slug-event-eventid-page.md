# /client/[slug]/event/[eventId]

Generated from the current working tree on 2026-04-10 22:05:59.

- Route file: `src/app/client/[slug]/event/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/formatters.tsx, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/components/progress-bar.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, … (+2 more)
- Feature modules touched: client-portal, events, invitations, event-comments, agent-outcomes, approvals, event-follow-up-items, system-events, assets, notifications, campaigns
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts, src/lib/constants.ts, src/lib/agent-dispatch.ts, src/lib/utils.ts
- Database objects touched: tm_events, meta_campaigns, event_snapshots, tm_event_demographics, campaign_client_overrides, clients, client_members, client_member_campaigns, client_member_events, event_comments, leads, client_access_invites, agent_tasks, system_events, … (+8 more)
- Direct tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/event/[eventId]`; exports: EventDetailPage, default; internal imports: 12; package imports: 2

## Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / client: src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/components/progress-bar.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/event-discussion-form.tsx
- src/components / client: src/components/client/charts/index.ts, src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, src/components/client/charts/ticket-sales-chart.tsx, … (+2 more)
- src/components / ui: src/components/ui/button.tsx
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/scope.ts, src/features/client-portal/types.ts, src/features/client-portal/insights.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- src/features / event-follow-up-items: src/features/event-follow-up-items/server.ts
- src/features / events: src/features/events/client-operating.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts, src/lib/constants.ts, src/lib/agent-dispatch.ts, src/lib/utils.ts
