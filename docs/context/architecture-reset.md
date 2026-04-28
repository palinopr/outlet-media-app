# Architecture Reset

The reset target is a smaller, maintainable web product centered on Campaigns, Events, Reports, and the admin access backbone.

## Current Decisions

- Remove unfinished standalone surfaces rather than preserving dead navigation.
- Keep Campaigns, Events, and Reports as the active client/admin product core.
- Keep the shipped client campaign experience analytics-first; request/comment workflow panels are retired for now.
- Treat `system_events` as the shared product activity timeline.
- Keep route handlers thin and feature modules reusable.
- Retire agent runtime/product code for now.

## Removed Scope

The reset deleted or retired:

- admin Agents page and web agent endpoints
- client Agent tab and client agent chat APIs
- agent task/outcome loaders and widgets
- top-level Discord/runtime agent project
- standalone workflow surfaces that duplicated campaign/event/report context
- client/admin request tabs, comment forms, and request APIs that added workflow breadth without current product value

Historical migrations may still show how older tables were introduced, but new code should not depend on those retired concepts. A cleanup migration removes the active agent tables/columns from the database.

## Rebuild Rule

If a removed surface returns, rebuild it only through a deliberate product decision, a small vertical slice, shared domain objects, access tests, and explicit verification. Do not resurrect old route-local logic or hidden background queues for convenience.
