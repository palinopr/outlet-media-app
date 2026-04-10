# Impact: src/features/access/revalidation.ts

Generated from the current working tree on 2026-04-10 18:46:37.

- Category: Feature files
- Impact score: 24
- Ownership: feature module: access
- Feature module: access
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: __tests__/features/access/revalidation.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts
- Tests related: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: clients
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: calls revalidatePath()
- Depends on groups: none
- Used by groups: Tests / Features, src/app / admin
- Summary: exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1
