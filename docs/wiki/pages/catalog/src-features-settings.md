# src/features / settings

Generated from the current working tree on 2026-04-28 02:30:43.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/settings/connected-accounts.ts`
- Status: tracked-clean
- System: web
- Group: src/features / settings
- Ownership: feature module: settings
- Type: TypeScript module
- Construction: code module
- Lines: 126
- Bytes: 3435
- Imported by: __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/settings/page.tsx
- Used by groups: Tests / Features, src/app / admin
- Feature module: settings
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Routes related (direct): src/app/admin/settings/page.tsx
- Tests related: __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts
- Exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary
- Symbol details: function getConnectedAccountHealth (exported), function buildConnectedAccountsSummary (exported), function asDate, function daysUntil, const DAY_MS, const EXPIRING_SOON_DAYS, const STALE_DAYS, type ConnectedAccountHealthKey (exported), interface ConnectedAccount (exported), interface ConnectedAccountHealth (exported), interface ConnectedAccountsSummary (exported)
- Defines: asDate, daysUntil, getConnectedAccountHealth, buildConnectedAccountsSummary, DAY_MS, EXPIRING_SOON_DAYS, STALE_DAYS, parsed, expiry, daysRemaining, recentActivity, inactiveDays, … (+6 more)
- Contents summary: exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary
