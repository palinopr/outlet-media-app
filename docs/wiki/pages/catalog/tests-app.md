# Tests / App

Generated from the current working tree on 2026-04-28 02:57:59.

- Files: 1
- File kinds: test file (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `__tests__/app/client/campaign-detail-data.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / App
- Ownership: app route/surface test suite
- Type: test file
- Construction: test specification
- Lines: 266
- Bytes: 7955
- Imports (internal): src/app/client/[slug]/campaign/[campaignId]/data.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/app / client, src/lib
- Defines: applyFilters, buildClient, serviceState, userScopedState, rows, detail
- Tests / describe labels: client campaign detail reads, prefers the Clerk-scoped client for client campaign detail reads, keeps admin client-portal viewers on the service role fallback, falls back to Meta campaign info for new campaigns before the DB sync row exists, allows assigned new campaigns even when client ownership is not inferable yet
- Contents summary: tests/describes: client campaign detail reads; prefers the Clerk-scoped client for client campaign detail reads; keeps admin client-portal viewers on the service role fallback; internal imports: 4; package imports: 2
