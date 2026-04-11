# src/features / settings

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 2
- File kinds: TypeScript module (2)

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
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/settings/page.tsx, src/features/settings/summary.ts
- Used by groups: src/app / admin, src/features / settings
- Feature module: settings
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Routes related (direct): src/app/admin/settings/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, __tests__/features/settings/summary.test.ts, src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): src/app/admin/clients/data.test.ts
- Exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary
- Symbol details: function getConnectedAccountHealth (exported), function buildConnectedAccountsSummary (exported), function asDate, function daysUntil, const DAY_MS, const EXPIRING_SOON_DAYS, const STALE_DAYS, type ConnectedAccountHealthKey (exported), interface ConnectedAccount (exported), interface ConnectedAccountHealth (exported), interface ConnectedAccountsSummary (exported)
- Defines: asDate, daysUntil, getConnectedAccountHealth, buildConnectedAccountsSummary, DAY_MS, EXPIRING_SOON_DAYS, STALE_DAYS, parsed, expiry, daysRemaining, recentActivity, inactiveDays, … (+6 more)
- Contents summary: exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary

## `src/features/settings/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / settings
- Ownership: feature module: settings
- Type: TypeScript module
- Construction: code module
- Lines: 154
- Bytes: 5008
- Imports (internal): src/features/shared/admin-summary-types.ts, src/features/invitations/sort.ts, src/features/settings/connected-accounts.ts
- Imported by: __tests__/features/settings/summary.test.ts, src/app/admin/settings/page.tsx
- Depends on groups: src/features / shared, src/features / invitations, src/features / settings
- Used by groups: Tests / Features, src/app / admin
- Feature module: settings
- Route owners: src/app/admin/settings/page.tsx
- Routes related (direct): src/app/admin/settings/page.tsx
- Tests related: __tests__/features/settings/summary.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/features/settings/summary.test.ts
- Exports: buildPlatformSettingsSummary, PlatformSettingsMetricKey, PlatformKeyStatus, PlatformSettingsMetric, PlatformSettingsSummary
- Symbol details: function buildPlatformSettingsSummary (exported), type PlatformSettingsMetricKey (exported), interface PlatformKeyStatus (exported), interface PlatformSettingsMetric (exported), interface PlatformSettingsSummary (exported)
- Defines: buildPlatformSettingsSummary, now, configuredIntegrations, missingIntegrations, connectionSummary, accessInvites, pendingInviteCount, expiredInviteCount, clientsNeedingSetup, accountsBySlug, existing, connectionRiskClients, … (+8 more)
- Contents summary: exports: buildPlatformSettingsSummary, PlatformSettingsMetricKey, PlatformKeyStatus, PlatformSettingsMetric, PlatformSettingsSummary; internal imports: 3
