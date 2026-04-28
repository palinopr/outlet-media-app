# Impact: src/app/admin/actions/clients.ts

Generated from the current working tree on 2026-04-28 02:30:43.

- Category: Admin actions
- Impact score: 68
- Ownership: web admin route surface
- Feature module: none
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-detail.test.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: meta_campaigns, client_accounts, system_events, clients, client_members, client_member_campaigns, campaign_client_overrides, if
- Env vars: none
- Mutation symbols: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole, changeClientMemberScope, updateMemberCampaigns, renameClientSlugReferences, RenameClientSchema, … (+2 more)
- Auth signals: references membership/scope access concepts
- Behavior signals: calls revalidatePath(), server action/module
- Depends on groups: src/lib, src/app / admin, src/features / access
- Used by groups: src/components / admin
- Summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2
