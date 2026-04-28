# Tests / API

Generated from the current working tree on 2026-04-28 03:23:46.

- Files: 1
- File kinds: test file (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `__tests__/api/ingest.test.ts`
- Status: modified
- System: tests
- Group: Tests / API
- Ownership: API test suite
- Type: test file
- Construction: test specification
- Lines: 236
- Bytes: 6934
- Imports (internal): __tests__/setup.ts, src/app/api/ingest/route.ts
- Imports (packages): vitest
- Depends on groups: Tests / Root, src/app / api
- Symbol details: function makeRequest, const originalEnv
- Defines: makeRequest, makeGetRequest, originalEnv, res, body, mockUpsert, mockSnapshotUpsert, mockStaleQuery, campaign
- Tests / describe labels: POST /api/ingest — auth, rejects oversized requests before parsing, returns 401 when secret is wrong, returns 400 when secret is missing, rejects retired ingest sources at validation, returns error message for unknown source, POST /api/ingest — supabase unavailable, returns 500 when supabaseAdmin is null, … (+4 more)
- Contents summary: tests/describes: POST /api/ingest — auth; rejects oversized requests before parsing; returns 401 when secret is wrong; internal imports: 2; package imports: 1
