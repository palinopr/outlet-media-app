# Impact: src/app/admin/actions/clients.ts

Generated from the current working tree on 2026-04-10 22:12:57.

- Category: Admin actions
- Impact score: 111
- Ownership: web admin route surface
- Feature module: none
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/client-onboard-form.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-detail.test.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: tm_events, meta_campaigns, client_accounts, system_events, approval_requests, campaign_action_items, campaign_comments, email_events, email_reply_examples, crm_contacts, crm_follow_up_items, asset_comments, … (+14 more)
- Env vars: none
- Mutation symbols: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole, changeClientMemberScope, updateMemberCampaigns, updateMemberEvents, renameClientSlugReferences, … (+3 more)
- Auth signals: references membership/scope access concepts
- Behavior signals: calls revalidatePath(), server action/module
- Depends on groups: src/lib, src/app / admin, src/features / access
- Used by groups: src/components / admin
- Summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2
