# Impact: src/features/invitations/server.ts

Generated from the current working tree on 2026-04-10 21:27:09.

- Category: Feature files
- Impact score: 28
- Ownership: feature module: invitations
- Feature module: invitations
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/features/invitations/server.test.ts
- Tests related: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- DB objects: clients, client_access_invites
- Env vars: none
- Mutation symbols: none
- Auth signals: imports Clerk server auth
- Behavior signals: none
- Depends on groups: src/lib, src/features / invitations
- Used by groups: src/app / admin, src/features / invitations
- Summary: exports: buildActionableInvitations, listActionableInvitations; internal imports: 3; package imports: 1
