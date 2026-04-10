# /admin/campaigns/[campaignId]

Generated from the current working tree on 2026-04-10 18:02:26.

- Route file: `src/app/admin/campaigns/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: calls notFound()
- Direct internal imports: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/client-requests-panel.tsx, src/features/campaigns/server.ts, src/lib/formatters.tsx, src/lib/status.ts
- Feature modules touched: campaigns, assets, campaign-action-items, campaign-comments, approvals, system-events, events, invitations, workflow, notifications, event-comments
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, src/lib/utils.ts, src/lib/member-access.ts, … (+2 more)
- Database objects touched: meta_campaigns, clients, system_events, approval_requests, campaign_action_items, campaign_comments, notifications, campaign_client_overrides, ad_assets, tm_events, event_comments, event_follow_up_items, admin_activity, client_members, … (+5 more)
- Direct tests: src/app/admin/campaigns/[campaignId]/page.test.tsx
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Contents summary: Next.js page for `/admin/campaigns/[campaignId]`; exports: AdminCampaignDetailPage, default; internal imports: 6; package imports: 3

## Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / admin: src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- src/components / admin: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/client-requests-panel.tsx, src/components/admin/confirm-dialog.tsx
- src/components / ui: src/components/ui/button.tsx
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/lib.ts, src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-action-items: src/features/campaign-action-items/server.ts
- src/features / campaign-comments: src/features/campaign-comments/server.ts
- src/features / campaigns: src/features/campaigns/server.ts, src/features/campaigns/ownership-sync.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, src/lib/utils.ts, src/lib/member-access.ts, … (+2 more)
