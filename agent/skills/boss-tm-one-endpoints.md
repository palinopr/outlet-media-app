# TM One API Endpoint Discovery — Feb 27 2026

## Problem
Our TM One account (media buyer / `app_caui` role) returns null from `/api/prd119/api/caui/events/info` for ticket sales fields. But Jaime can see the data in the browser dashboard.

## Root Cause
The `/events/info` endpoint is permission-restricted for our role. But the browser uses DIFFERENT endpoints to populate the dashboard — specifically the Reports gadget (PRD119).

## Key Finding: `/tour/comparison` Endpoint
Found via JS bundle analysis of the TM One Reports React app (`/cdn/@ticketmaster/PRD119/reports/2.280.0/`).

The `/tour/comparison` endpoint is the ONLY other REST endpoint the JS bundle explicitly calls (besides `/caui/events/info`). It returns:
- `soldTotal` — tickets sold
- `totalCapacity` — total capacity
- `totalRevenue` — gross revenue
- `eventName`, `venueName`, `venueCity`
- Per-price-level breakdowns

Full URL:
```
GET /tour/comparison?uid={email}&aid={aid}&eventId={surrogateId}&onsale=true&offset=0&limit=50
```

## Auth
- Cookie-based (Okta OAuth2 via b2bid-login.ticketmaster.com)
- Client ID: 0ob7nisx9eQYkJZsb2e5
- Must be called from Playwright browser context with `credentials: 'include'`

## Architecture
- TM One = UFO Microfrontend (PRD3100 portal shell + PRD119 Reports gadget)
- Redux middleware pattern with CALL_API action type
- CDN bundles at: /cdn/@ticketmaster/PRD119/reports/{version}/

## Report Types Available
- summary, sales-comparison, event-audit, sales-by-location, upcoming-events, settlement-reports, scheduled-reports, platinum, inventory-status, channel-sales

## Fallback Strategy
1. Try `/tour/comparison` endpoint from browser fetch
2. Network intercept on Event Summary page
3. DOM scrape the Summary report page

## Related
- Demographics endpoint WORKS: `/api/prd119/api/caui/events/demographics/info`
- Sales-by-location page WORKS: `/app/reporting/type/sales-by-location/eventId/{id}/...`
