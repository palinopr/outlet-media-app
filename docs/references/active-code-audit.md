# Active Code Audit — 2026-04-28

Scope: narrowed Outlet web baseline only — admin Dashboard, Campaigns, Clients, Users, Settings; client Campaigns portal; public landing/legal/contact/health/Meta deletion endpoints.

## Automated inventory

- Active non-test `src` TypeScript/React files: 200
- App/proxy/instrumentation entry files: 60
- Import-graph unreachable active files: 0
- Retired surface scan found no active Ticketmaster/TM1, WhatsApp/concierge, Google Ads, Shopify, agent, approval, conversation, workspace, CRM, or ticketing product code. Remaining string hits are documentation/privacy copy or `user_agent` telemetry.

## Active route/API posture

- Admin routes stay behind Clerk admin layout.
- Client routes resolve through DB-backed `client_members` / invite acceptance before access.
- Public APIs are limited to contact, ingest, health, Meta callback, and Meta data deletion.
- Mutating JSON APIs have request size guards; public APIs also have IP rate limits or signed/secret validation.
- Events/Reports direct routes are intentional redirect guards only.

## Cleanup/fixes completed in this audit

- Removed unused landing components, obsolete landing CSS helpers, old client portal re-export files, and unused text/client-detail helpers.
- Replaced route-local client portal helper imports with feature-level `features/client-portal/*` imports.
- Hardened `fetchAllCampaigns()` so Meta failures are no longer silently treated as successful empty data.
- Added Supabase campaign fallback for campaign lists when Meta credentials/API are unavailable.
- Preserved DB campaign ownership metadata during live Meta reads.
- Tightened admin invite handling for existing admin users and pending admin invitations.
- Added request size guards and stronger DB error checks on active admin/user/observability APIs.
- Fixed Telegram workflow alert scripts to run Node ESM when using top-level `await`.

## Follow-up outside code audit

- Rotate the Telegram bot token that was pasted in chat.
- Run one controlled real invite acceptance test with an email the owner controls.
- Continue 24-hour production monitor observation after deploy.
