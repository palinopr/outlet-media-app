# Impact: src/lib/request-guards.ts

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Shared web libraries
- Impact score: 23
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts
- Imported by: src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, src/lib/request-guards.test.ts
- Tests related: src/lib/request-guards.test.ts, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/api/meta/data-deletion/route.test.ts
- DB objects: if
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / api, src/lib
- Summary: exports: getClientIp, enforceContentLength, enforceRateLimit, resetRateLimitsForTests; tests/describes: ,; internal imports: 1
