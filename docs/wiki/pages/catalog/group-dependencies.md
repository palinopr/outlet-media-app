# Group Dependency Map

Generated from the current working tree on 2026-04-10 22:12:57.

This page summarizes internal file-to-file dependencies rolled up to the catalog group level.

## agent / config
- Files in group: 1
- Depends on groups: none
- Used by groups: none

## agent / context
- Files in group: 2
- Depends on groups: none
- Used by groups: none

## agent / prompts
- Files in group: 1
- Depends on groups: none
- Used by groups: none

## agent / root
- Files in group: 13
- Depends on groups: none
- Used by groups: none

## agent / scripts
- Files in group: 5
- Depends on groups: none
- Used by groups: none

## agent/src / discord
- Files in group: 3
- Depends on groups: agent/src / services (4), agent/src / utils (2), agent/src / events (2), agent/src / root (1)
- Used by groups: agent/src / events (4), agent/src / root (1)

## agent/src / events
- Files in group: 2
- Depends on groups: agent/src / discord (4), agent/src / root (2), agent/src / services (2), agent/src / utils (1)
- Used by groups: agent/src / discord (2)

## agent/src / root
- Files in group: 3
- Depends on groups: agent/src / utils (2), agent/src / discord (1)
- Used by groups: agent/src / events (2), agent/src / services (2), agent/src / discord (1)

## agent/src / services
- Files in group: 9
- Depends on groups: agent/src / utils (3), agent/src / root (2)
- Used by groups: agent/src / discord (4), agent/src / events (2)

## agent/src / utils
- Files in group: 4
- Depends on groups: none
- Used by groups: agent/src / services (3), agent/src / discord (2), agent/src / root (2), agent/src / events (1)

## Docs / Context
- Files in group: 17
- Depends on groups: none
- Used by groups: none

## Docs / Plans
- Files in group: 30
- Depends on groups: none
- Used by groups: none

## Docs / References
- Files in group: 2
- Depends on groups: none
- Used by groups: none

## Docs / Root
- Files in group: 2
- Depends on groups: none
- Used by groups: none

## Docs / Screenshots
- Files in group: 30
- Depends on groups: none
- Used by groups: src/components / landing (4)

## Docs / Superpowers Plans
- Files in group: 11
- Depends on groups: none
- Used by groups: none

## Docs / Superpowers Specs
- Files in group: 10
- Depends on groups: none
- Used by groups: none

## Docs / Wiki (manual control pages)
- Files in group: 10
- Depends on groups: none
- Used by groups: none

## .github
- Files in group: 2
- Depends on groups: none
- Used by groups: none

## Root Mocks
- Files in group: 1
- Depends on groups: none
- Used by groups: none

## Public Assets
- Files in group: 17
- Depends on groups: none
- Used by groups: none

## Root Files
- Files in group: 24
- Depends on groups: none
- Used by groups: src/app / api (1)

## src/app / admin
- Files in group: 54
- Depends on groups: src/lib (61), src/components / admin (59), src/components / ui (29), src/features / workflow (5), src/features / system-events (4), src/features / invitations (4), src/features / settings (4), src/features / reports (4), src/features / campaigns (3), src/features / events (3), src/features / campaign-action-items (2), src/features / notifications (2), … (+8 more)
- Used by groups: src/components / admin (35), src/app / root routes (13)

## src/app / api
- Files in group: 40
- Depends on groups: src/lib (73), src/features / client-agent (8), src/features / system-events (6), src/features / workflow (6), src/lib / ticketmaster (6), src/features / notifications (4), src/features / client-portal (4), src/features / agent-outcomes (2), src/features / campaign-action-items (2), src/features / campaign-comments (2), src-features-event-comments (2), src/features / events (2), … (+3 more)
- Used by groups: Tests / API (5)

## src/app / client
- Files in group: 63
- Depends on groups: src/lib (37), src/features / client-portal (25), src/components / client (15), src/components / ui (7), src/features / reports (4), src/features / client-agent (3), src/features / campaigns (3), src/features / events (3), src/components / charts (2), src/features / campaign-comments (1), src-features-event-comments (1), src/components / admin (1)
- Used by groups: src/app / root routes (6), Tests / App (3), src/components / client (2), src/features / client-portal (2), src/app / admin (1)

## src/app / root routes
- Files in group: 18
- Depends on groups: src/app / admin (13), src/components / landing (6), src/app / client (6), src/features / client-portal (1)
- Used by groups: none

## src/components / admin
- Files in group: 64
- Depends on groups: src/components / ui (44), src/lib (41), src/app / admin (35), src/features / agents (2), src/features / campaigns (2), src/features / agent-outcomes (1), src/features / invitations (1), src / hooks (1), src/components / shared (1), src/features / events (1)
- Used by groups: src/app / admin (59), src/app / client (1)

## src/components / charts
- Files in group: 2
- Depends on groups: none
- Used by groups: src/app / admin (2), src/app / client (2)

## src/components / client
- Files in group: 17
- Depends on groups: src/app / client (2), src/lib (1), src/components / shared (1), src/components / ui (1)
- Used by groups: src/app / client (15)

## src/components / landing
- Files in group: 10
- Depends on groups: Docs / Screenshots (4), src/components / ui (2), src/lib (1)
- Used by groups: src/app / root routes (6)

## src/components / shared
- Files in group: 1
- Depends on groups: src/components / ui (1)
- Used by groups: src/components / admin (1), src/components / client (1)

## src/components / ui
- Files in group: 13
- Depends on groups: src/lib (13)
- Used by groups: src/components / admin (44), src/app / admin (29), src/app / client (7), src/components / landing (2), src/components / client (1), src/components / shared (1)

## src/features / access
- Files in group: 1
- Depends on groups: none
- Used by groups: src/app / admin (2), Tests / Features (1)

## src/features / agent-outcomes
- Files in group: 2
- Depends on groups: src/features / assets (1), src/lib (1)
- Used by groups: Tests / Features (6), src/app / api (2), src/features / campaigns (2), src/features / events (2), src/features / reports (2), src/app / admin (1), src/components / admin (1), src/features / agents (1), src/features / operations-center (1)

## src/features / agents
- Files in group: 1
- Depends on groups: src/features / agent-outcomes (1), src/features / operations-center (1), src/lib (1)
- Used by groups: src/components / admin (2), Tests / Features (1), src/app / admin (1)

## src/features / approvals
- Files in group: 2
- Depends on groups: src/lib (4), src/features / assets (1)
- Used by groups: Tests / Features (6), src/features / campaigns (2), src/features / dashboard (1), src/features / events (1)

## src/features / asset-follow-up-items
- Files in group: 1
- Depends on groups: src/lib (4), src/features / notifications (1), src/features / system-events (1)
- Used by groups: src/app / api (1)

## src/features / assets
- Files in group: 3
- Depends on groups: src/lib (4)
- Used by groups: Tests / Features (7), src/features / campaigns (2), src/features / agent-outcomes (1), src/features / approvals (1), src/features / conversations (1), src/features / notifications (1)

## src/features / campaign-action-items
- Files in group: 2
- Depends on groups: src/lib (7), src/features / notifications (2), src/features / system-events (2)
- Used by groups: src/app / admin (2), src/app / api (2), src/features / campaigns (2), Tests / Features (1)

## src/features / campaign-comments
- Files in group: 1
- Depends on groups: src/lib (2)
- Used by groups: src/app / api (2), src/features / campaigns (2), Tests / Features (1), src/app / client (1)

## src/features / campaigns
- Files in group: 4
- Depends on groups: src/lib (4), src/features / campaign-action-items (2), src/features / campaign-comments (2), src/features / approvals (2), src/features / system-events (2), src/features / agent-outcomes (2), src/features / assets (2), src/features / client-portal (1), src/features / events (1)
- Used by groups: src/app / admin (3), src/app / client (3), src/components / admin (2), src/features / notifications (1)

## src/features / client-agent
- Files in group: 33
- Depends on groups: src/features / reports (10), src/features / client-portal (6), src/lib (5), src/features / system-events (2), src/features / workflow (2)
- Used by groups: src/app / api (8), src/app / client (3)

## src/features / client-portal
- Files in group: 13
- Depends on groups: src/lib (11), src/app / client (2)
- Used by groups: src/app / client (25), src/features / client-agent (6), src/app / api (4), Tests / Features (2), src/features / reports (2), src/app / root routes (1), src/features / campaigns (1), src/features / events (1)

## src/features / clients
- Files in group: 1
- Depends on groups: none
- Used by groups: src/app / admin (2), Tests / Features (1)

## src/features / conversations
- Files in group: 2
- Depends on groups: src/lib (3), src/features / assets (1)
- Used by groups: Tests / Features (5), src/features / dashboard (2)

## src/features / dashboard
- Files in group: 2
- Depends on groups: src/lib (4), src/features / conversations (2), src/features / approvals (1)
- Used by groups: Tests / Features (6), src/features / reports (2)

## src-features-event-comments
- Files in group: 1
- Depends on groups: src/lib (2)
- Used by groups: src/app / api (2), src/features / events (2), src/app / client (1)

## src/features / event-follow-up-items
- Files in group: 1
- Depends on groups: src/lib (4), src/features / notifications (1), src/features / system-events (1)
- Used by groups: Tests / Features (1), src/app / admin (1), src/app / api (1), src/features / events (1)

## src/features / events
- Files in group: 3
- Depends on groups: src/lib (6), src/features / agent-outcomes (2), src-features-event-comments (2), src/features / system-events (2), src/features / approvals (1), src/features / client-portal (1), src/features / event-follow-up-items (1)
- Used by groups: Tests / Features (4), src/app / admin (3), src/app / client (3), src/app / api (2), src/features / reports (2), src/components / admin (1), src/features / campaigns (1)

## src/features / invitations
- Files in group: 4
- Depends on groups: src/lib (1)
- Used by groups: src/app / admin (4), src/components / admin (1), src/features / settings (1), src/features / shared (1), src/features / users (1), src/lib (1)

## src/features / notifications
- Files in group: 4
- Depends on groups: src/lib (3), src/features / assets (1), src/features / campaigns (1)
- Used by groups: Tests / Features (7), src/app / api (4), src/app / admin (2), src/features / campaign-action-items (2), src/features / asset-follow-up-items (1), src/features / event-follow-up-items (1)

## src/features / operations-center
- Files in group: 1
- Depends on groups: src/features / agent-outcomes (1)
- Used by groups: Tests / Features (1), src/features / agents (1)

## src/features / reports
- Files in group: 3
- Depends on groups: src/lib (6), src/features / client-portal (2), src/features / agent-outcomes (2), src/features / dashboard (2), src/features / events (2)
- Used by groups: src/features / client-agent (10), Tests / Features (4), src/app / admin (4), src/app / client (4)

## src/features / root files
- Files in group: 1
- Depends on groups: none
- Used by groups: none

## src/features / settings
- Files in group: 2
- Depends on groups: src/features / shared (1), src/features / invitations (1)
- Used by groups: src/app / admin (4), Tests / Features (1)

## src/features / shared
- Files in group: 1
- Depends on groups: src/features / invitations (1)
- Used by groups: Tests / Features (1), src/features / settings (1), src/features / users (1)

## src/features / system-events
- Files in group: 1
- Depends on groups: src/lib (1)
- Used by groups: Tests / Features (6), src/app / api (6), src/app / admin (4), src/features / campaign-action-items (2), src/features / campaigns (2), src/features / client-agent (2), src/features / events (2), src/features / asset-follow-up-items (1), src/features / event-follow-up-items (1), src/lib (1)

## src/features / users
- Files in group: 1
- Depends on groups: src/features / shared (1), src/features / invitations (1)
- Used by groups: Tests / Features (1), src/app / admin (1)

## src/features / workflow
- Files in group: 2
- Depends on groups: none
- Used by groups: src/app / api (6), src/app / admin (5), src/features / client-agent (2)

## src / hooks
- Files in group: 1
- Depends on groups: none
- Used by groups: src/components / admin (1)

## src/lib
- Files in group: 32
- Depends on groups: src/features / system-events (1), src/features / invitations (1)
- Used by groups: src/app / api (73), src/app / admin (61), src/components / admin (41), src/app / client (37), Tests / Features (24), src/components / ui (13), src/features / client-portal (11), Tests / App (7), src/features / campaign-action-items (7), src/features / events (6), src/features / reports (6), src/features / client-agent (5), … (+21 more)

## src/lib / ticketmaster
- Files in group: 2
- Depends on groups: none
- Used by groups: src/app / api (6)

## src / Root
- Files in group: 2
- Depends on groups: src/lib (1)
- Used by groups: none

## src / scripts
- Files in group: 4
- Depends on groups: src/lib (1)
- Used by groups: none

## supabase / migrations
- Files in group: 67
- Depends on groups: none
- Used by groups: none

## supabase / root
- Files in group: 1
- Depends on groups: none
- Used by groups: none

## Tests / API
- Files in group: 5
- Depends on groups: src/app / api (5), Tests / Root (4), src/lib (2)
- Used by groups: none

## Tests / App
- Files in group: 3
- Depends on groups: src/lib (7), src/app / client (3)
- Used by groups: none

## Tests / Features
- Files in group: 36
- Depends on groups: src/lib (24), src/features / assets (7), src/features / notifications (7), src/features / agent-outcomes (6), src/features / approvals (6), src/features / system-events (6), src/features / dashboard (6), src/features / conversations (5), src/features / events (4), src/features / reports (4), src/features / client-portal (2), src/features / access (1), … (+9 more)
- Used by groups: none

## Tests / Lib
- Files in group: 4
- Depends on groups: src/lib (4)
- Used by groups: none

## Tests / Root
- Files in group: 1
- Depends on groups: src/lib (1)
- Used by groups: Tests / API (4)
