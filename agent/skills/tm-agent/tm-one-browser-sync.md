> Auto-created by TM Data on 2026-03-05

# TM One Data Sync via Playwright Browser Context

## Overview
TM One's API requires an active browser session — raw HTTP requests with cookies or Bearer tokens return the SPA shell (HTML) instead of JSON. All API calls must be made from within a Playwright page context after login.

## Procedure

### 1. Refresh Cookies (Playwright Login)
- Use a **fresh** browser context (do NOT load expired cookies — they interfere with the login redirect)
- Navigate to TM One login, wait for `input[name="identifier"]` after auth redirect
- Complete login flow, then save storage state

### 2. Make API Calls from Page Context
- After login, use `page.evaluate(() => fetch(...))` to call APIs from within the browser session
- Direct HTTP requests (even with valid cookies/tokens) return HTML, not JSON

### 3. Correct API Endpoint Format
```
Base: /api/prd119/api/caui/
```
- Events demographics: `/api/prd119/api/caui/events/demographics/info`
- Events info: `/api/prd119/api/caui/events/info` (returns empty fields due to account permissions)
- Tour comparison: `/api/prd119/api/caui/tour/comparison`

**Common mistake**: omitting the `/api/caui/` prefix (e.g., using `/api/prd119/tour/comparison` instead of `/api/prd119/api/caui/tour/comparison`).

### 4. Ingest to Supabase
- POST scraped data to `/api/ingest` route
- Ingest uses conditional spread — only updates ticket fields when non-null (prevents null overwrites)

## Troubleshooting
| Symptom | Cause | Fix |
|---|---|---|
| Login selector not found | Timing issue or stale cookies loaded | Use fresh context, add wait |
| API returns HTML | Request made outside browser context | Use `page.evaluate(fetch(...))` |
| API returns empty fields | Account-level permission restriction | Expected for `/events/info` endpoint |
| Cookie refresh fails | Loading expired cookies before login | Skip loading old cookies |