# TM1 Browserless API

Use this note when building TM1 automation that should not depend on a foreground Chrome tab.

## Preferred Shape

- Use official Ticketmaster public APIs where they cover the job:
  - Discovery API for event identity and public metadata
  - Inventory Status API for supported availability reads
  - Partner API for supported partner-grade reserve/purchase workflows
- For TM1-only reporting and seat-map operations, use a server-side HTTP client against the TM1 internal endpoints instead of AppleScript or browser driving:
  - `caui` for analytics/reporting reads
  - `eventbase` (`/api/events/...`) for inventory layout and move-selection writes

## Why

Browser-driven TM1 scripts were useful for discovery, but they are brittle for automation:
- they depend on an active Chrome profile
- they depend on AppleScript and local UI state
- they are hard to run safely in background jobs
- they are the wrong transport for write automation

The better transport is:
- direct HTTPS requests to `https://one.ticketmaster.com/api/prd119/api/caui/...`
- direct HTTPS requests to `https://one.ticketmaster.com/api/events/...`
- env-managed TM1 session auth
- explicit audit logging and approvals around write actions

## What Exists In Repo

- `src/lib/ticketmaster/tm1-client.ts`
  - browserless TM1 HTTP client
  - summary normalization
  - event snapshot helper
  - eventbase context reads for `inventory`, `geometry`, and `event`
  - move-selection writes for `open` and `allocation` targets
- `src/app/api/ticketmaster/tm1/snapshot/route.ts`
  - secret-protected or admin-session-protected snapshot route
- `src/app/api/ticketmaster/tm1/move-selection/route.ts`
  - secret-protected or admin-session-protected direct eventbase seat move route
- `src/app/api/ticketmaster/tm1/request-move-selection/route.ts`
  - secret-protected or admin-session-protected TM1 collaboration change-request route for move-to-allocation requests
- `agent/scripts/tm1-map-source-maps.mjs`
  - fetches loaded TM1 source maps and extracts classes, methods, and backend URL templates
  - writes a human summary to `docs/context/tm1-prd130-capability-map.md`
  - writes the full machine-readable map to `session/tm1-prd130-capability-map.json`
- `agent/scripts/tm1-crawl-capabilities.mjs`
  - crawls TM1 routes or browser-discovered JS assets
  - recursively discovers TM1 chunks and source maps
  - writes a broader human summary to `docs/context/tm1-capability-map.md`
  - writes the full merged capability map to `session/tm1-capability-map.json`
  - writes crawl metadata to `session/tm1-crawl-assets.json`
- `agent/session/tm1-cookie-refresh.mjs`
  - validates the saved TM1 session first
  - if expired, runs Playwright login with `TM_EMAIL` + `TM_PASSWORD`
  - handles the common TM1 email-verification flow by fetching the fresh 6-digit code from Gmail
  - saves refreshed browser session state to `agent/session/tm1-storage-state.json`
- `agent/session/tm1-http-sync.mjs`
  - reads the saved TM1 browser session state from `tm1-storage-state.json`
  - uses the stored cookies/token for read-only TM1 HTTP sync without foreground browser control

## Capability Mapping

Run:
- `npm run tm1:map`
- `npm run tm1:crawl -- --event-id <tm1_event_id>`

Use this when you need to discover additional TM1 services or mutation families without guessing from minified bundles.

Important scope note:
- the generated capability map reflects the currently scanned PRD130 source maps
- it is a map of the loaded TM1 event-management module, not a complete map of the entire TM1 platform

If shell env does not contain `TM1_COOKIE`, the crawler can still run from browser-discovered asset seeds:
- collect loaded JS asset URLs from an authenticated TM1 Chrome tab
- pass them as repeated `--asset-url <url>` arguments
- the crawler will recurse public chunks and source maps from those seeds without requiring route HTML fetches

## Move-Selection Write Path

Dynamic seating writes are ready for the TM1 operations we actually use to stage demand:
- move selected seats/sections to a target allocation or hold via `POST /api/events/events/{eventId}/inventory/moveSelection/allocation/{targetId}`
- move selected seats/sections back to open via `POST /api/events/events/{eventId}/inventory/moveSelection/standardOfferAllocation`

The browserless client now:
- resolves dashboard/public-style event ids to internal eventbase UUIDs through `GET /api/events/events/{publicId}/id` when needed
- auto-fetches `inventory.version` from `GET /api/events/events/{eventId}/inventory`
- auto-fetches `layout.version` from `GET /api/events/events/{eventId}/geometry`
- auto-fetches `Etag-external-event-version` from `GET /api/events/events/{eventId}`
- applies TM1 optimistic-lock headers on the write:
  - `If-Match: "{inventoryVersion}"`
  - `Etag-external-event-version: {externalEventVersion}` when TM1 returns one

Important live implementation note from the Ataca Sergio investigation:
- allocation move `targetId` must be the actual hold object's UUID, not the display string like `4-HOLD`
- for that event, `4-HOLD` existed as allocation-group label but the move path only accepted the underlying hold UUID (`e7e21c15-c913-328b-826d-64a00a23aad2`)

## Collaboration Request Path

A later live TM1 scrape showed that direct eventbase writes are not the only inventory mutation family.

TM1 also supports a collaboration/request-review path for allocation moves:
- create request: `POST /api/events/collaboration/{eventId}/team/messages`
- resolve request: `POST /api/events/collaboration/{eventId}/team/request/{id}/resolve`

For move-to-allocation requests, the body shape includes:
- `changeRequest.type = "MOVE_TO_ALLOCATION"`
- `changeRequest.data.destination = <hold uuid>`
- `changeRequest.data.destinationType = 2`
- `changeRequest.data.totalPlaces = <count>`
- `changeRequest.data.selection = { placeSelections | rowSelections | rsSectionSelections ... }`

Important live finding:
- the Jamie / Outlet collaboration history already contained real Ataca Sergio `CHANGE_REQUEST` and `REQUEST_APPROVAL` messages for `MOVE_TO_ALLOCATION` into `4-HOLD`
- a later safe browserless validation also succeeded with:
  - `POST /team/messages` for a deliberately bogus move-to-allocation request
  - `POST /team/request/{id}/resolve` with `DELETED` to clean it up
- that proved the current session can create and resolve collaboration change requests even while direct `inventory/moveSelection/...` writes still 403
- so the correct solution path for this session is not only `inventory/moveSelection/...`
- it is also the collaboration request flow above

Later live Ataca Sergio verification added an important caution:
- the earlier Wave 1 request was approved by a different TM1 user and later showed strong live inventory evidence inside `4-HOLD`
- the later Wave 2 request was self-resolved to `ACCEPTED` by the same Jamie requestor session
- but a later inventory read still showed the Wave 2 sections open and showed no Wave 2 seats inside `4-HOLD`
- treat collaboration `ACCEPTED` as workflow state, not final proof of live inventory mutation
- always verify the actual seat-state change with a fresh inventory read after approval

## Current Limitation

The browserless write path is intentionally narrow:
- supported now: `allocation` and `open` move-selection targets for seating/hold staging
- supported now: collaboration `MOVE_TO_ALLOCATION` change requests and request resolution
- not yet implemented: price-level, attribute, pricing-type, or allocation-group delete flows

Live permission finding from the Ataca Sergio wave-one attempt:
- the Jamie / Outlet TM1 session could read eventbase inventory successfully
- the same session still received `403 Forbidden` on `moveSelection` writes
- the exposed eventbase token looked read-oriented and identified the event role as `CONTENT_REVIEWER` / `GUEST`
- the event dashboard also called `GET /api/events/authorization/event/{eventId}`
- that event ACL came back with event permissions showing only `READ`
- the Inventory map rendered the seatmap container in `readOnlyTool` mode

So technical payload correctness is not enough by itself; the TM1 session must also have write-capable event permissions, and the Inventory UI itself can surface as read-only when the event ACL is read-only.

Headed operator fallback:
- `agent/session/tm1-wave-one-4hold-operator.mjs` opens the live Inventory page in Playwright, lets a human log in with a stronger TM1 user if needed, then performs the same browser-scoped move-selection call with that live session
- default target is Ataca Sergio Wave 1 to `4-HOLD` (`e7e21c15-c913-328b-826d-64a00a23aad2`)
- dry run: `node agent/session/tm1-wave-one-4hold-operator.mjs`
- live attempt after operator login: `node agent/session/tm1-wave-one-4hold-operator.mjs --execute`

If you need a new TM1 mutation family, capture it from the source maps or a real trace first. Do not guess at payload structure.

## Env

- `TM1_BASE_URL`
- `TM1_API_PREFIX`
- `TM1_EVENTBASE_API_PREFIX`
- `TM1_TCODE`
- `TM1_COOKIE`
- `TM1_XSRF_TOKEN`
- `TM1_DEFAULT_EVENT_START`
- `TM1_DEFAULT_EVENT_END`
- `TM1_TIMEOUT_MS`

For the Playwright-backed TM1 session refresh path, the repo also uses:

- `TM_EMAIL`
- `TM_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

That second group is what lets the repo auto-read TM1 email verification codes from Gmail when Ticketmaster asks for MFA.

Live implementation note:
- a real TM1 login on 2026-04-08 showed that Ticketmaster email subjects may arrive as `Your one-time code: ######`
- Gmail code-extraction logic should not depend too narrowly on `subject:verification`; search recent Ticketmaster mail broadly enough to match real MFA email variants
- the TM1 cookie refresh flow was patched the same day to use a broader Ticketmaster query and include the email subject in 6-digit code extraction
