# Feature: access

Generated from the current working tree on 2026-04-28 02:57:59.

- Files: 1
- Entry files: src/features/access/revalidation.ts
- Component files: none
- Client files: none
- Server files: none
- Route users: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Database objects touched: clients, if
- Depends on feature modules: none
- Used by feature modules: none
- Auth/access signals: none
- Behavior signals: calls revalidatePath()
- Direct tests: __tests__/features/access/revalidation.test.ts
- All linked tests: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts

## Exporting files
- `src/features/access/revalidation.ts` — exports: getAccessManagementPaths, revalidateAccessManagementPaths

## File list
- `src/features/access/revalidation.ts` — exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1
