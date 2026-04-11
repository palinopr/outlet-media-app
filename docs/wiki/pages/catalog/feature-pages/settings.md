# Feature: settings

Generated from the current working tree on 2026-04-10 21:37:00.

- Files: 2
- Entry files: src/features/settings/connected-accounts.ts, src/features/settings/summary.ts
- Component files: none
- Client files: none
- Server files: none
- Route users: src/app/admin/settings/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Database objects touched: client_accounts, clients
- Depends on feature modules: shared (1), invitations (1)
- Used by feature modules: none
- Auth/access signals: none
- Behavior signals: none
- Direct tests: src/app/admin/clients/data.test.ts, __tests__/features/settings/summary.test.ts
- All linked tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, __tests__/features/settings/summary.test.ts, src/components/admin/clients/client-detail.test.tsx

## Exporting files
- `src/features/settings/connected-accounts.ts` — exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary
- `src/features/settings/summary.ts` — exports: buildPlatformSettingsSummary, PlatformSettingsMetricKey, PlatformKeyStatus, PlatformSettingsMetric, PlatformSettingsSummary

## File list
- `src/features/settings/connected-accounts.ts` — exports: getConnectedAccountHealth, buildConnectedAccountsSummary, ConnectedAccountHealthKey, ConnectedAccount, ConnectedAccountHealth, ConnectedAccountsSummary
- `src/features/settings/summary.ts` — exports: buildPlatformSettingsSummary, PlatformSettingsMetricKey, PlatformKeyStatus, PlatformSettingsMetric, PlatformSettingsSummary; internal imports: 3
