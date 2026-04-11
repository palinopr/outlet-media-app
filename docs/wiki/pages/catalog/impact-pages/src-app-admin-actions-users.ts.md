# Impact: src/app/admin/actions/users.ts

Generated from the current working tree on 2026-04-10 21:37:00.

- Category: Admin actions
- Impact score: 42
- Ownership: web admin route surface
- Feature module: none
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/users/user-table.tsx
- Tests related: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- DB objects: clients, client_access_invites
- Env vars: none
- Mutation symbols: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation, ChangeRoleSchema, BulkUpdateRoleSchema, failed, DeleteUserSchema, RevokeInvitationSchema
- Auth signals: imports Clerk server auth
- Behavior signals: server action/module
- Depends on groups: src/lib, src/app / admin, src/features / access
- Used by groups: src/components / admin
- Summary: exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation; tests/describes: user; invitation; internal imports: 4; package imports: 2
