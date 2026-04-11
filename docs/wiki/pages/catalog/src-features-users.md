# src/features / users

Generated from the current working tree on 2026-04-10 21:27:09.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/users/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / users
- Ownership: feature module: users
- Type: TypeScript module
- Construction: code module
- Lines: 69
- Bytes: 2207
- Imports (internal): src/features/shared/admin-summary-types.ts, src/features/invitations/sort.ts
- Imported by: __tests__/features/users/summary.test.ts, src/app/admin/users/page.tsx
- Depends on groups: src/features / shared, src/features / invitations
- Used by groups: Tests / Features, src/app / admin
- Feature module: users
- Route owners: src/app/admin/users/page.tsx
- Routes related (direct): src/app/admin/users/page.tsx
- Tests related: __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/features/users/summary.test.ts
- Exports: buildUsersAccessSummary, UsersAccessSummary
- Symbol details: function buildUsersAccessSummary (exported), function compareCreatedAtDesc, function compareAccessInvitePriority, function compareClientCoverage, interface UsersAccessSummary (exported)
- Defines: compareCreatedAtDesc, compareAccessInvitePriority, compareClientCoverage, buildUsersAccessSummary, accessInvites, pendingInviteCount, expiredInviteCount, unassignedClientUsers, clientsNeedingCoverage, UsersAccessSummary
- Contents summary: exports: buildUsersAccessSummary, UsersAccessSummary; internal imports: 2
