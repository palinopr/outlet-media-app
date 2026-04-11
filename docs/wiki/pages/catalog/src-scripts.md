# src / scripts

Generated from the current working tree on 2026-04-10 22:05:59.

- Files: 4
- File kinds: TypeScript module (4)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/scripts/google-ads-build-ataca-sergio-search.ts`
- Status: tracked-clean
- System: web
- Group: src / scripts
- Ownership: web/dev script
- Type: TypeScript module
- Construction: code module
- Lines: 410
- Bytes: 13483
- Imports (packages): node:fs, node:path
- Symbol details: function main, function mutate, function loadLocalEnv, const FINAL_URL, const CAMPAIGN_NAME, const DAILY_BUDGET_MICROS, const DEFAULT_CPC_BID_MICROS, const START_DATE, const END_DATE, const OUTPUT_PATH, const LOCATIONS, const AD_GROUPS, interface GoogleAdsCredentialsLike
- Defines: main, mutate, loadLocalEnv, FINAL_URL, CAMPAIGN_NAME, DAILY_BUDGET_MICROS, DEFAULT_CPC_BID_MICROS, START_DATE, END_DATE, OUTPUT_PATH, LOCATIONS, AD_GROUPS, … (+26 more)
- Contents summary: package imports: 2

## `src/scripts/google-ads-discover-accounts.ts`
- Status: tracked-clean
- System: web
- Group: src / scripts
- Ownership: web/dev script
- Type: TypeScript module
- Construction: code module
- Lines: 234
- Bytes: 6468
- Imports (internal): src/lib/google-ads.ts
- Imports (packages): node:fs, node:path
- Depends on groups: src/lib
- Symbol details: function walk, function numberOrNull, function microsToUsd, function loadLocalEnv, function getCliValue, function getPositionalArg, const rootCustomerIdArg, const googleAds, const credentials, const rootCustomerId, const accessToken, const visited, type CustomerRow, type CustomerClientRow, type CustomerMetricsRow, type ManagerNode, … (+1 more)
- Defines: walk, numberOrNull, microsToUsd, loadLocalEnv, getCliValue, getPositionalArg, rootCustomerIdArg, googleAds, credentials, rootCustomerId, accessToken, visited, … (+19 more)
- Contents summary: internal imports: 1; package imports: 2

## `src/scripts/google-ads-first-read.ts`
- Status: tracked-clean
- System: web
- Group: src / scripts
- Ownership: web/dev script
- Type: TypeScript module
- Construction: code module
- Lines: 67
- Bytes: 1961
- Imports (packages): node:fs, node:path
- Symbol details: function loadLocalEnv, function getCliValue, function getPositionalCustomerId, const customerIdArg, const loginCustomerIdArg
- Defines: loadLocalEnv, getCliValue, getPositionalCustomerId, customerIdArg, loginCustomerIdArg, snapshot, filePath, content, line, separatorIndex, key, prefix
- Contents summary: package imports: 2

## `src/scripts/shopify-first-read.ts`
- Status: tracked-clean
- System: web
- Group: src / scripts
- Ownership: web/dev script
- Type: TypeScript module
- Construction: code module
- Lines: 63
- Bytes: 1785
- Imports (packages): node:fs, node:path
- Symbol details: function loadLocalEnv, function getCliValue, const storeDomainArg, const apiVersionArg
- Defines: loadLocalEnv, getCliValue, storeDomainArg, apiVersionArg, snapshot, filePath, content, line, separatorIndex, key, prefix
- Contents summary: package imports: 2
