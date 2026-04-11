# src/lib / ticketmaster

Generated from the current working tree on 2026-04-10 22:05:59.

- Files: 2
- File kinds: test file (1), TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/lib/ticketmaster/tm1-client.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib / ticketmaster
- Ownership: shared Ticketmaster library
- Type: test file
- Construction: test specification
- Lines: 461
- Bytes: 14012
- Imports (internal): src/lib/ticketmaster/tm1-client.ts
- Imports (packages): vitest
- Depends on groups: src/lib / ticketmaster
- Symbol details: function createTestJwt
- Defines: createTestJwt, summary, fetchMock, client, result, headers, body, resolvedEventId, firstUrl, finalUrl, eventbaseToken
- Tests / describe labels: normalizeTm1Summary, normalizes nested TM1 figures and derives available values, falls back across alternate field names, Tm1Client moveSelection, auto-fetches context and posts allocation moves with TM1 optimistic-lock headers, uses caller-supplied versions for open moves and strips selections from successAction, resolves dashboard-style event ids to internal UUIDs before eventbase writes, Tm1Client collaboration move requests, … (+2 more)
- Contents summary: tests/describes: normalizeTm1Summary; normalizes nested TM1 figures and derives available values; falls back across alternate field names; internal imports: 1; package imports: 1

## `src/lib/ticketmaster/tm1-client.ts`
- Status: tracked-clean
- System: web
- Group: src/lib / ticketmaster
- Ownership: shared Ticketmaster library
- Type: TypeScript module
- Construction: code module
- Lines: 1009
- Bytes: 31540
- Imports (packages): node:crypto
- Imported by: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts, src/lib/ticketmaster/tm1-client.test.ts
- Used by groups: src/app / api, src/lib / ticketmaster
- Route owners: src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts
- Routes related (direct): src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts
- Tests related: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Tests related (direct): src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Exports: normalizeTm1Summary, createTm1ClientFromEnv, TM1_DEFAULT_BASE_URL, TM1_DEFAULT_API_PREFIX, TM1_DEFAULT_EVENTBASE_API_PREFIX, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_EXTERNAL_EVENT_VERSION_HEADER, TM1_IF_MATCH_HEADER, TM1_INVENTORY_ASSOCIATED_ACTION, TM1_INVENTORY_SET_TYPE_ALLOCATION, TM1_OPEN_SEAT_STATUS, … (+29 more)
- Symbol details: function normalizeTm1Summary (exported), function createTm1ClientFromEnv (exported), function isRecord, function toNumber, function extractNumericValue, function firstNumericValue, function parseEtagVersion, function encodeIfMatch, function isUuid, function ensureRecordPayload, function extractInventoryVersion, function extractLayoutVersion, function extractExternalEventVersion, function withQuery, function sanitizeSuccessAction, function defaultSuccessAction, … (+8 more)
- Defines: isRecord, toNumber, extractNumericValue, firstNumericValue, parseEtagVersion, encodeIfMatch, isUuid, ensureRecordPayload, extractInventoryVersion, extractLayoutVersion, extractExternalEventVersion, withQuery, … (+103 more)
- Tests / describe labels: .
- Contents summary: exports: normalizeTm1Summary, createTm1ClientFromEnv, TM1_DEFAULT_BASE_URL, TM1_DEFAULT_API_PREFIX, TM1_DEFAULT_EVENTBASE_API_PREFIX, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_EXTERNAL_EVENT_VERSION_HEADER; tests/describes: .; package imports: 1
