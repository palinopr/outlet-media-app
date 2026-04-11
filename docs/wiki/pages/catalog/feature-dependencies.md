# Feature Module Dependency Map

Generated from the current working tree on 2026-04-10 21:51:44.

This page rolls internal dependencies up to the `src/features/*` module level and shows which route/component groups use each feature module.

## src/features / access
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: none
- Used by groups: src/app / admin (2), Tests / Features (1)
- Direct route users: none

## src/features / agent-outcomes
- Files in module: 2
- Depends on feature modules: assets (1)
- Depends on groups: src/features / assets (1), src/lib (1)
- Used by groups: Tests / Features (6), src/app / api (2), src/features / campaigns (2), src/features / events (2), src/features / reports (2), src/app / admin (1), src/components / admin (1), src/features / agents (1), src/features / operations-center (1)
- Direct route users: src/app/api/agent-outcomes/action-item/route.ts

## src/features / agents
- Files in module: 1
- Depends on feature modules: agent-outcomes (1), operations-center (1)
- Depends on groups: src/features / agent-outcomes (1), src/features / operations-center (1), src/lib (1)
- Used by groups: src/components / admin (2), Tests / Features (1), src/app / admin (1)
- Direct route users: none

## src/features / approvals
- Files in module: 2
- Depends on feature modules: assets (1)
- Depends on groups: src/lib (4), src/features / assets (1)
- Used by groups: Tests / Features (6), src/features / campaigns (2), src/features / dashboard (1), src/features / events (1)
- Direct route users: none

## src/features / asset-follow-up-items
- Files in module: 1
- Depends on feature modules: notifications (1), system-events (1)
- Depends on groups: src/lib (4), src/features / notifications (1), src/features / system-events (1)
- Used by groups: src/app / api (1)
- Direct route users: src/app/api/agent-outcomes/action-item/route.ts

## src/features / assets
- Files in module: 3
- Depends on feature modules: none
- Depends on groups: src/lib (4)
- Used by groups: Tests / Features (7), src/features / campaigns (2), src/features / agent-outcomes (1), src/features / approvals (1), src/features / conversations (1), src/features / notifications (1)
- Direct route users: none

## src/features / campaign-action-items
- Files in module: 2
- Depends on feature modules: notifications (2), system-events (2)
- Depends on groups: src/lib (7), src/features / notifications (2), src/features / system-events (2)
- Used by groups: src/app / admin (2), src/app / api (2), src/features / campaigns (2), Tests / Features (1)
- Direct route users: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts

## src/features / campaign-comments
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: src/lib (2)
- Used by groups: src/app / api (2), src/features / campaigns (2), Tests / Features (1), src/app / client (1)
- Direct route users: src/app/api/campaign-comments/route.ts

## src/features / campaigns
- Files in module: 4
- Depends on feature modules: campaign-action-items (2), campaign-comments (2), approvals (2), system-events (2), agent-outcomes (2), assets (2), client-portal (1), events (1)
- Depends on groups: src/lib (4), src/features / campaign-action-items (2), src/features / campaign-comments (2), src/features / approvals (2), src/features / system-events (2), src/features / agent-outcomes (2), src/features / assets (2), src/features / client-portal (1), src/features / events (1)
- Used by groups: src/app / client (3), src/app / admin (3), src/components / admin (2), src/features / notifications (1)
- Direct route users: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx

## src/features / client-agent
- Files in module: 33
- Depends on feature modules: reports (10), client-portal (6), system-events (2), workflow (2)
- Depends on groups: src/features / reports (10), src/features / client-portal (6), src/lib (5), src/features / system-events (2), src/features / workflow (2)
- Used by groups: src/app / api (8), src/app / client (3)
- Direct route users: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx

## src/features / client-portal
- Files in module: 13
- Depends on feature modules: none
- Depends on groups: src/lib (11), src/app / client (2)
- Used by groups: src/app / client (25), src/features / client-agent (6), src/app / api (4), Tests / Features (2), src/features / reports (2), src/app / root routes (1), src/features / campaigns (1), src/features / events (1)
- Direct route users: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/page.tsx, src/app/page.tsx

## src/features / clients
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: none
- Used by groups: src/app / admin (2), Tests / Features (1)
- Direct route users: src/app/admin/clients/page.tsx

## src/features / conversations
- Files in module: 2
- Depends on feature modules: assets (1)
- Depends on groups: src/lib (3), src/features / assets (1)
- Used by groups: Tests / Features (5), src/features / dashboard (2)
- Direct route users: none

## src/features / dashboard
- Files in module: 2
- Depends on feature modules: conversations (2), approvals (1)
- Depends on groups: src/lib (4), src/features / conversations (2), src/features / approvals (1)
- Used by groups: Tests / Features (6), src/features / reports (2)
- Direct route users: none

## src-features-event-comments
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: src/lib (2)
- Used by groups: src/app / api (2), src/features / events (2), src/app / client (1)
- Direct route users: src/app/api/event-comments/route.ts

## src/features / event-follow-up-items
- Files in module: 1
- Depends on feature modules: notifications (1), system-events (1)
- Depends on groups: src/lib (4), src/features / notifications (1), src/features / system-events (1)
- Used by groups: Tests / Features (1), src/app / admin (1), src/app / api (1), src/features / events (1)
- Direct route users: src/app/api/agent-outcomes/action-item/route.ts

## src/features / events
- Files in module: 3
- Depends on feature modules: agent-outcomes (2), event-comments (2), system-events (2), approvals (1), client-portal (1), event-follow-up-items (1)
- Depends on groups: src/lib (6), src/features / agent-outcomes (2), src-features-event-comments (2), src/features / system-events (2), src/features / approvals (1), src/features / client-portal (1), src/features / event-follow-up-items (1)
- Used by groups: Tests / Features (4), src/app / client (3), src/app / admin (3), src/app / api (2), src/features / reports (2), src/components / admin (1), src/features / campaigns (1)
- Direct route users: src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx

## src/features / invitations
- Files in module: 4
- Depends on feature modules: none
- Depends on groups: src/lib (1)
- Used by groups: src/app / admin (4), src/components / admin (1), src/features / settings (1), src/features / users (1), src/features / shared (1), src/lib (1)
- Direct route users: none

## src/features / notifications
- Files in module: 4
- Depends on feature modules: assets (1), campaigns (1)
- Depends on groups: src/lib (3), src/features / assets (1), src/features / campaigns (1)
- Used by groups: Tests / Features (7), src/app / api (4), src/app / admin (2), src/features / campaign-action-items (2), src/features / asset-follow-up-items (1), src/features / event-follow-up-items (1)
- Direct route users: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts

## src/features / operations-center
- Files in module: 1
- Depends on feature modules: agent-outcomes (1)
- Depends on groups: src/features / agent-outcomes (1)
- Used by groups: Tests / Features (1), src/features / agents (1)
- Direct route users: none

## src/features / reports
- Files in module: 3
- Depends on feature modules: client-portal (2), agent-outcomes (2), dashboard (2), events (2)
- Depends on groups: src/lib (6), src/features / client-portal (2), src/features / agent-outcomes (2), src/features / dashboard (2), src/features / events (2)
- Used by groups: src/features / client-agent (10), src/app / admin (4), src/app / client (4), Tests / Features (4)
- Direct route users: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx

## src/features / settings
- Files in module: 2
- Depends on feature modules: shared (1), invitations (1)
- Depends on groups: src/features / shared (1), src/features / invitations (1)
- Used by groups: src/app / admin (4), Tests / Features (1)
- Direct route users: src/app/admin/settings/page.tsx

## src/features / shared
- Files in module: 1
- Depends on feature modules: invitations (1)
- Depends on groups: src/features / invitations (1)
- Used by groups: Tests / Features (1), src/features / settings (1), src/features / users (1)
- Direct route users: none

## src/features / system-events
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: src/lib (1)
- Used by groups: Tests / Features (6), src/app / api (6), src/app / admin (4), src/features / campaign-action-items (2), src/features / campaigns (2), src/features / client-agent (2), src/features / events (2), src/features / asset-follow-up-items (1), src/features / event-follow-up-items (1), src/lib (1)
- Direct route users: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts

## src/features / users
- Files in module: 1
- Depends on feature modules: shared (1), invitations (1)
- Depends on groups: src/features / shared (1), src/features / invitations (1)
- Used by groups: Tests / Features (1), src/app / admin (1)
- Direct route users: src/app/admin/users/page.tsx

## src/features / workflow
- Files in module: 2
- Depends on feature modules: none
- Depends on groups: none
- Used by groups: src/app / api (6), src/app / admin (5), src/features / client-agent (2)
- Direct route users: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
