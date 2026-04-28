# src/features / access

Generated from the current working tree on 2026-04-28 03:23:46.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/access/revalidation.ts`
- Status: tracked-clean
- System: web
- Group: src/features / access
- Ownership: feature module: access
- Type: TypeScript module
- Construction: code module
- Lines: 28
- Bytes: 728
- Imports (packages): next/cache
- Imported by: __tests__/features/access/revalidation.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts
- Used by groups: Tests / Features, src/app / admin
- Feature module: access
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/features/access/revalidation.test.ts
- Exports: getAccessManagementPaths, revalidateAccessManagementPaths
- Symbol details: function getAccessManagementPaths (exported), function revalidateAccessManagementPaths (exported), interface AccessManagementPathsInput
- Defines: getAccessManagementPaths, revalidateAccessManagementPaths, paths, AccessManagementPathsInput
- Contents summary: exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1
