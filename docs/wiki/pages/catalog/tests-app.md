# Tests / App

Generated from the current working tree on 2026-04-10 18:02:26.

- Files: 3
- File kinds: test file (3)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `__tests__/app/client/campaign-detail-data.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / App
- Ownership: app route/surface test suite
- Type: test file
- Construction: test specification
- Lines: 154
- Bytes: 4276
- Imports (internal): src/app/client/[slug]/campaign/[campaignId]/data.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/app / client, src/lib
- Defines: applyFilters, buildClient, serviceState, userScopedState, rows, detail
- Tests / describe labels: client campaign detail reads, prefers the Clerk-scoped client for client campaign detail reads, keeps admin client-portal viewers on the service role fallback
- Contents summary: tests/describes: client campaign detail reads; prefers the Clerk-scoped client for client campaign detail reads; keeps admin client-portal viewers on the service role fallback; internal imports: 4; package imports: 2

## `__tests__/app/client/data.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / App
- Ownership: app route/surface test suite
- Type: test file
- Construction: test specification
- Lines: 194
- Bytes: 5576
- Imports (internal): src/app/client/[slug]/data.ts, src/lib/supabase.ts, src/lib/meta-campaigns.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/app / client, src/lib
- Symbol details: function makeCampaign, function makeEvent
- Defines: applyFilters, buildClient, makeCampaign, makeEvent, serviceState, userScopedState, values, query, rows, data
- Tests / describe labels: client portal data reads, prefers the Clerk-scoped client for client event and audience reads, keeps admin portal viewers on the service role for event lists
- Contents summary: tests/describes: client portal data reads; prefers the Clerk-scoped client for client event and audience reads; keeps admin portal viewers on the service role for event lists; internal imports: 3; package imports: 2

## `__tests__/app/client/event-detail-data.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / App
- Ownership: app route/surface test suite
- Type: test file
- Construction: test specification
- Lines: 206
- Bytes: 6020
- Imports (internal): src/app/client/[slug]/event/[eventId]/data.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/app / client, src/lib
- Symbol details: function makeEventRow
- Defines: applyFilters, buildClient, makeEventRow, serviceState, userScopedState, query, rows, detail
- Tests / describe labels: client event detail reads, prefers the Clerk-scoped client for client event detail reads, keeps admin client-portal viewers on the service role for event detail reads
- Contents summary: tests/describes: client event detail reads; prefers the Clerk-scoped client for client event detail reads; keeps admin client-portal viewers on the service role for event detail reads; internal imports: 3; package imports: 2
