# Feature: campaign-comments

Generated from the current working tree on 2026-04-10 21:51:44.

- Files: 1
- Entry files: src/features/campaign-comments/server.ts
- Component files: none
- Client files: none
- Server files: src/features/campaign-comments/server.ts
- Route users: src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Database objects touched: campaign_comments
- Depends on feature modules: none
- Used by feature modules: campaigns (2)
- Auth/access signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Behavior signals: none
- Direct tests: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts
- All linked tests: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts

## Exporting files
- `src/features/campaign-comments/server.ts` — exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment

## File list
- `src/features/campaign-comments/server.ts` — exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment; internal imports: 2; package imports: 1
