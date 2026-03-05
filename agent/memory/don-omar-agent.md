# Don Omar Agent Memory

## Platform
- EATA / Vivaticket: entradasatualcance.com/backstage
- Auth: OAuth2 access_token (saved in session/eata-auth.json)
- Team ID: 1578
- Client slug: don_omar_bcn

## Events
- Venue: Estadio Olimpico Lluis Companys, Barcelona
- Artist: Don Omar
- Event IDs use `eata_{id}` prefix in Supabase

## Sync
- HTTP sync script: session/eata-http-sync.mjs
- Cookie refresh: session/eata-cookie-refresh.mjs (Playwright login)
- Cron: every 2 hours (sync), every 6 hours (token refresh)
- Ingest source: "ticketmaster_one" (shared with TM events)
