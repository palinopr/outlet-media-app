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
  - secret-protected or admin-session-protected seat move route
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
- auto-fetches `inventory.version` from `GET /api/events/events/{eventId}/inventory`
- auto-fetches `layout.version` from `GET /api/events/events/{eventId}/geometry`
- auto-fetches `Etag-external-event-version` from `GET /api/events/events/{eventId}`
- applies TM1 optimistic-lock headers on the write:
  - `If-Match: "{inventoryVersion}"`
  - `Etag-external-event-version: {externalEventVersion}` when TM1 returns one

## Current Limitation

The browserless write path is intentionally narrow:
- supported now: `allocation` and `open` move-selection targets for seating/hold staging
- not yet implemented: price-level, attribute, pricing-type, or allocation-group delete flows

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
