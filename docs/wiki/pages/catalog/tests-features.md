# Tests / Features

Generated from the current working tree on 2026-04-28 02:32:49.

- Files: 7
- File kinds: test file (7)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `__tests__/features/access/revalidation.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 29
- Bytes: 772
- Imports (internal): src/features/access/revalidation.ts
- Imports (packages): vitest
- Depends on groups: src/features / access
- Tests / describe labels: access management revalidation paths, covers the shared admin access surfaces, includes client detail and portal settings when client context is present
- Contents summary: tests/describes: access management revalidation paths; covers the shared admin access surfaces; includes client detail and portal settings when client context is present; internal imports: 1; package imports: 1

## `__tests__/features/client-portal/scope.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 18
- Bytes: 573
- Imports (internal): src/features/client-portal/scope.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-portal
- Defines: scope
- Tests / describe labels: client portal scope helpers, allows campaigns when no assigned scope exists, restricts access to explicitly assigned campaign ids
- Contents summary: tests/describes: client portal scope helpers; allows campaigns when no assigned scope exists; restricts access to explicitly assigned campaign ids; internal imports: 1; package imports: 1

## `__tests__/features/clients/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 46
- Bytes: 1146
- Imports (internal): src/features/clients/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / clients
- Defines: ranked
- Tests / describe labels: client account summary helpers, treats connection risk as the only client attention signal, ranks clients by connection pressure before spend
- Contents summary: tests/describes: client account summary helpers; treats connection risk as the only client attention signal; ranks clients by connection pressure before spend; internal imports: 1; package imports: 1

## `__tests__/features/settings/connected-accounts.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 63
- Bytes: 1825
- Imports (internal): src/features/settings/connected-accounts.ts
- Imports (packages): vitest
- Depends on groups: src/features / settings
- Symbol details: function account, const now
- Defines: account, now, ConnectedAccount
- Tests / describe labels: connected account health, classifies healthy, expiring, stale, and disconnected Meta accounts, summarizes attention counts without pulling in client or user setup state
- Contents summary: tests/describes: connected account health; classifies healthy, expiring, stale, and disconnected Meta accounts; summarizes attention counts without pulling in client or user setup state; internal imports: 1; package imports: 1

## `__tests__/features/shared/admin-summary-types.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 11
- Bytes: 382
- Imports (internal): src/features/shared/admin-summary-types.ts
- Imports (packages): vitest
- Depends on groups: src/features / shared
- Tests / describe labels: admin summary shared types module, exports shared admin summary contracts for feature modules
- Contents summary: tests/describes: admin summary shared types module; exports shared admin summary contracts for feature modules; internal imports: 1; package imports: 1

## `__tests__/features/system-events/list.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 208
- Bytes: 5886
- Imports (internal): src/features/system-events/server.ts, src/lib/supabase.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / system-events, src/lib
- Defines: applyFilters, buildClient, serviceState, userScopedState, query, rows, data, supabaseAdminClient, userScopedSupabaseClient, createClerkSupabaseClientFn, currentUserFn, getFeatureReadClientFn, … (+3 more)
- Tests / describe labels: listSystemEvents, prefers the Clerk-scoped client for client-scoped event lists, keeps admin viewers on the service role for client-scoped event lists
- Contents summary: tests/describes: listSystemEvents; prefers the Clerk-scoped client for client-scoped event lists; keeps admin viewers on the service role for client-scoped event lists; internal imports: 2; package imports: 2

## `__tests__/features/users/summary.test.ts`
- Status: tracked-clean
- System: tests
- Group: Tests / Features
- Ownership: feature test suite
- Type: test file
- Construction: test specification
- Lines: 91
- Bytes: 2579
- Imports (internal): src/features/users/summary.ts
- Imports (packages): vitest
- Depends on groups: src/features / users
- Defines: summary
- Tests / describe labels: buildUsersAccessSummary, surfaces pending invites, unassigned client users, and weak client coverage
- Contents summary: tests/describes: buildUsersAccessSummary; surfaces pending invites, unassigned client users, and weak client coverage; internal imports: 1; package imports: 1
