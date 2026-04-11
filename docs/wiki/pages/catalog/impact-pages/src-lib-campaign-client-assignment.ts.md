# Impact: src/lib/campaign-client-assignment.ts

Generated from the current working tree on 2026-04-10 21:27:09.

- Category: Shared web libraries
- Impact score: 203
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, … (+13 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, … (+19 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/campaign-comments/route.test.ts, src/lib/campaign-client-assignment.test.ts, src/components/admin/clients/client-detail.test.tsx, … (+50 more)
- DB objects: meta_campaigns, campaign_client_overrides
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: Tests / App, Tests / Features, src/app / admin, src/app / api, src/app / client, src/features / approvals, src/features / assets, src/features / campaign-action-items, src/features / campaigns, src/features / conversations, … (+4 more)
- Summary: exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug; internal imports: 2
