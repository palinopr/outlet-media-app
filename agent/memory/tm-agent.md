# TM Agent Memory

## Role
Ticketmaster One specialist. Scrapes event data from one.ticketmaster.com via Playwright browser automation.
Extracts event listings, ticket counts, and sales metrics.

## TM One Access
- URL: https://one.ticketmaster.com
- Login: email (TM_EMAIL in .env) -> password (TM_PASSWORD in .env) -> 2FA magic link
- Credentials: jaime@outletmedia.net
- TM_PASSWORD: still blank in .env -- TM sync won't work until provided

## Scraper Architecture
- Fast scraper (GraphQL-only): captures 25 events via GraphQL interception. Works reliably.
- Full scraper: tries per-event API calls after GraphQL. Per-event API returns empty data (known permissions issue). Not critical.
- Both variants handle login flow: email -> password -> 2FA magic link -> dashboard

## Current Events (25 total, scraped Feb 24)
- 20 Arjona tour dates
- 4 Camila dates
- 1 Alofoke (Boston Mar 2)
- Sacramento Arjona: missing from GraphQL (known gap)
- Houston: no TM event found (campaign exists but no TM listing)

## Upcoming Shows (key dates)
- PAST: Seattle Feb 25 (PAUSED), Denver Feb 18 (PAUSED)
- IMMINENT: Portland Feb 26 (PAUSED), Inglewood Mar 1
- This week: Alofoke Boston Mar 2 (ACTIVE $250/day), San Jose Mar 6, San Diego Mar 7
- Mid-March: Palm Desert Mar 12, Anaheim Mar 14, Sacramento Mar 15, Glendale Mar 21
- Late March+: San Antonio Mar 26, Austin Mar 30, Miami Apr 3-8 (5 shows)

## Event Snapshots Pipeline
- Table: event_snapshots (UNIQUE tm_id + snapshot_date)
- 72 rows across 3 dates (Feb 23, 24, 25), 24 events per date
- Has: tickets_sold (int). Missing: tickets_available (null), gross (null)
- Pipeline working since ~Feb 23

## Data Storage
- Session file: session/last-events.json (25 events)
- Supabase table: tm_events
- Snapshot table: event_snapshots (daily snapshots)
