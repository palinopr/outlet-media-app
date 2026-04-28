# Impact: src/app/admin/actions/campaigns.ts

Generated from the current working tree on 2026-04-28 02:30:43.

- Category: Admin actions
- Impact score: 53
- Ownership: web admin route surface
- Feature module: none
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: meta_campaigns, system_events, clients, campaign_client_overrides, if
- Env vars: none
- Mutation symbols: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta, upsertCampaignClientOverrides, syncCampaignLinkedClientSlug, updateRes, UpdateStatusSchema, UpdateTypeSchema, UpdateBudgetSchema, … (+2 more)
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: calls revalidatePath(), server action/module
- Depends on groups: src/features / campaigns, src/lib, src/app / admin, src/features / system-events
- Used by groups: src/components / admin
- Summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 8; package imports: 3
