# Tests / API

Generated from the current working tree on 2026-04-10 22:12:57.

- Files: 5
- File kinds: test file (5)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `__tests__/api/agents-heartbeat.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / API
- Ownership: API test suite
- Type: test file
- Construction: test specification
- Lines: 121
- Bytes: 3539
- Imports (internal): __tests__/setup.ts, src/app/api/agents/heartbeat/route.ts
- Imports (packages): vitest
- Depends on groups: Tests / Root, src/app / api
- Symbol details: function makeRequest, const originalEnv
- Defines: makeRequest, originalEnv, req, res, body, mockUpsert
- Tests / describe labels: POST /api/agents/heartbeat, returns 401 when secret is wrong, returns 200 with ok true on successful insert, writes to agent_runtime_state, upserts a heartbeat payload with current fields, returns 500 when supabase upsert fails, returns ok false when upsert fails, POST /api/agents/heartbeat — supabase unavailable, … (+1 more)
- Contents summary: tests/describes: POST /api/agents/heartbeat; returns 401 when secret is wrong; returns 200 with ok true on successful insert; internal imports: 2; package imports: 1

## `__tests__/api/agents-jobs.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / API
- Ownership: API test suite
- Type: test file
- Construction: test specification
- Lines: 78
- Bytes: 2214
- Imports (internal): src/app/api/agents/jobs/route.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Imports (packages): vitest
- Depends on groups: src/app / api, src/lib
- Defines: mockJobs, res, body
- Tests / describe labels: GET /api/agents/jobs, returns jobs array on success, calls listAgentJobs with limit 30, returns 500 with generic error on failure, returns empty jobs array when listAgentJobs returns empty, returns 403 when admin guard fails
- Contents summary: tests/describes: GET /api/agents/jobs; returns jobs array on success; calls listAgentJobs with limit 30; internal imports: 3; package imports: 1

## `__tests__/api/agents.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / API
- Ownership: API test suite
- Type: test file
- Construction: test specification
- Lines: 373
- Bytes: 12007
- Imports (internal): __tests__/setup.ts, src/app/api/agents/route.ts
- Imports (packages): vitest
- Depends on groups: Tests / Root, src/app / api
- Defines: req, res, body, mockInsert, taskRow, dbRows, tmAgent
- Tests / describe labels: POST /api/agents, returns 400 for unknown agent, returns error message for unknown agent (Zod validation), accepts tm-monitor as valid agent, accepts meta-ads as valid agent, accepts campaign-monitor as valid agent, accepts assistant as valid agent, inserts a pending task with prompt, … (+4 more)
- Contents summary: tests/describes: POST /api/agents; returns 400 for unknown agent; returns error message for unknown agent (Zod validation); internal imports: 2; package imports: 1

## `__tests__/api/alerts.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / API
- Ownership: API test suite
- Type: test file
- Construction: test specification
- Lines: 320
- Bytes: 9800
- Imports (internal): __tests__/setup.ts, src/app/api/alerts/route.ts
- Imports (packages): vitest
- Depends on groups: Tests / Root, src/app / api
- Symbol details: const originalEnv
- Defines: makeGetRequest, originalEnv, req, res, body, mockInsert, mockIs, mockUpdate, alertRows, mockLimit
- Tests / describe labels: POST /api/alerts, returns 401 when secret is wrong, returns Unauthorized error message for wrong secret, returns 400 when message is empty, returns 400 when message is whitespace only, returns ok true on successful insert, inserts alert with trimmed message, defaults level to info when not provided, … (+4 more)
- Contents summary: tests/describes: POST /api/alerts; returns 401 when secret is wrong; returns Unauthorized error message for wrong secret; internal imports: 2; package imports: 1

## `__tests__/api/ingest.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / API
- Ownership: API test suite
- Type: test file
- Construction: test specification
- Lines: 419
- Bytes: 11997
- Imports (internal): __tests__/setup.ts, src/app/api/ingest/route.ts
- Imports (packages): vitest
- Depends on groups: Tests / Root, src/app / api
- Symbol details: function makeRequest, const originalEnv
- Defines: makeRequest, makeGetRequest, originalEnv, res, body, mockUpsert, mockSnapshotUpsert, event, mockStaleQuery, campaign
- Tests / describe labels: POST /api/ingest — auth, returns 401 when secret is wrong, returns 400 when secret is missing (Zod validation), returns 400 for unknown source, returns error message for unknown source (Zod validation), POST /api/ingest — supabase unavailable, returns 500 when supabaseAdmin is null, POST /api/ingest — ticketmaster_one source, … (+4 more)
- Contents summary: tests/describes: POST /api/ingest — auth; returns 401 when secret is wrong; returns 400 when secret is missing (Zod validation); internal imports: 2; package imports: 1
