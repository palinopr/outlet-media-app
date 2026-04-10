# /client/[slug]/campaign/[campaignId]

Generated from the current working tree on 2026-04-10 16:52:39.

- Route file: `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/access.ts, src/features/client-portal/theme.ts, … (+3 more)
- Feature modules touched: client-portal, campaigns, invitations, campaign-action-items, campaign-comments, approvals, system-events, agent-outcomes, notifications, assets
- Shared libs/runtime touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts, src/lib/meta-campaigns.ts, src/lib/agent-dispatch.ts, … (+1 more)
- Database objects touched: meta_campaigns, calls, tm_events, tm_event_demographics, campaign_client_overrides, clients, client_members, client_member_campaigns, client_member_events, client_access_invites, campaign_action_items, notifications, campaign_comments, approval_requests, … (+8 more)
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/campaign/[campaignId]`; exports: CampaignDetailPage, default; internal imports: 13; package imports: 2

## Stack by group
- src/app / client: src/app/client/[slug]/types.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/lib.ts, src/app/client/[slug]/data.ts, src/app/client/[slug]/components/campaign-status-badge.tsx, src/app/client/[slug]/components/campaign-discussion-form.tsx
- src/components / client: src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, … (+3 more)
- src/components / ui: src/components/ui/button.tsx
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-action-items: src/features/campaign-action-items/server.ts
- src/features / campaign-comments: src/features/campaign-comments/server.ts
- src/features / campaigns: src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.ts
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/theme.ts, src/features/client-portal/types.ts, src/features/client-portal/scope.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts, src/lib/meta-campaigns.ts, src/lib/agent-dispatch.ts, … (+1 more)
