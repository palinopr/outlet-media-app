# src/features / campaign-comments

Generated from the current working tree on 2026-04-10 18:02:26.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/campaign-comments/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaign-comments
- Ownership: feature module: campaign-comments
- Type: TypeScript module
- Construction: code module
- Lines: 101
- Bytes: 3063
- Imports (internal): src/lib/member-access.ts, src/lib/supabase.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / api, src/app / client, src/features / campaigns
- Feature module: campaign-comments
- Route owners: src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Routes related (direct): src/app/api/campaign-comments/route.ts
- Tests related: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts
- Exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment
- Symbol details: function listCampaignComments (exported), function canAccessCampaignComments (exported), function mapCampaignComment, type CampaignCommentVisibility (exported), interface CampaignComment (exported), interface ListCampaignCommentsOptions
- Defines: mapCampaignComment, listCampaignComments, canAccessCampaignComments, db, user, role, isAdmin, access, CampaignCommentVisibility, CampaignComment, ListCampaignCommentsOptions
- Contents summary: exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment; internal imports: 2; package imports: 1
