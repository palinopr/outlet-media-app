# Impact: src/lib/ticketmaster/tm1-client.ts

Generated from the current working tree on 2026-04-10 16:14:38.

- Category: Shared web libraries
- Impact score: 42
- Ownership: shared Ticketmaster library
- Feature module: none
- Route owners: src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts
- Imported by: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts, src/lib/ticketmaster/tm1-client.test.ts
- Tests related: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- DB objects: none
- Env vars: TM1_BASE_URL, TM1_API_PREFIX, TM1_EVENTBASE_API_PREFIX, TM1_TCODE, TM1_COOKIE, TM1_XSRF_TOKEN, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_TIMEOUT_MS
- Mutation symbols: createTm1ClientFromEnv, requestPath, requestId
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/app / api, src/lib / ticketmaster
- Summary: exports: normalizeTm1Summary, createTm1ClientFromEnv, TM1_DEFAULT_BASE_URL, TM1_DEFAULT_API_PREFIX, TM1_DEFAULT_EVENTBASE_API_PREFIX, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_EXTERNAL_EVENT_VERSION_HEADER; tests/describes: .; package imports: 1
