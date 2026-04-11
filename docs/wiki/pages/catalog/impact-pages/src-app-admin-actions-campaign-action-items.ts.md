# Impact: src/app/admin/actions/campaign-action-items.ts

Generated from the current working tree on 2026-04-10 22:05:59.

- Category: Admin actions
- Impact score: 25
- Ownership: web admin route surface
- Feature module: none
- Route owners: none
- Imported by: src/app/admin/actions/campaign-action-items.test.ts
- Tests related: src/app/admin/actions/campaign-action-items.test.ts
- DB objects: campaign_action_items, notifications
- Env vars: none
- Mutation symbols: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem, CreateCampaignActionItemSchema, UpdateCampaignActionItemSchema, createdItem, changedKeys, changedFields, updatedItem
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: server action/module
- Depends on groups: src/features / campaign-action-items, src/features / notifications, src/features / workflow, src/lib, src/app / admin, src/features / system-events
- Used by groups: src/app / admin
- Summary: exports: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem; tests/describes: campaign_action_item; internal imports: 10; package imports: 2
