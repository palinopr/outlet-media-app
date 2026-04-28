# Feature Module Dependency Map

Generated from the current working tree on 2026-04-28 02:32:49.

This page rolls internal dependencies up to the `src/features/*` module level and shows which route/component groups use each feature module.

## src/features / access
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: none
- Used by groups: src/app / admin (2), Tests / Features (1)
- Direct route users: none

## src/features / campaigns
- Files in module: 4
- Depends on feature modules: none
- Depends on groups: src/lib (6)
- Used by groups: src/app / admin (3), src/components / admin (2)
- Direct route users: src/app/admin/campaigns/[campaignId]/page.tsx

## src/features / client-portal
- Files in module: 13
- Depends on feature modules: none
- Depends on groups: src/lib (12), src/app / client (1)
- Used by groups: src/app / client (14), src/app / root routes (1), Tests / Features (1)
- Direct route users: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx

## src/features / clients
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: none
- Used by groups: Tests / Features (1), src/app / admin (1)
- Direct route users: src/app/admin/clients/page.tsx

## src/features / invitations
- Files in module: 4
- Depends on feature modules: none
- Depends on groups: src/lib (1)
- Used by groups: src/app / admin (4), src/components / admin (1), src/features / users (1), src/features / shared (1), src/lib (1)
- Direct route users: none

## src/features / settings
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: none
- Used by groups: src/app / admin (3), Tests / Features (1)
- Direct route users: src/app/admin/settings/page.tsx

## src/features / shared
- Files in module: 1
- Depends on feature modules: invitations (1)
- Depends on groups: src/features / invitations (1)
- Used by groups: Tests / Features (1), src/features / users (1)
- Direct route users: none

## src/features / system-events
- Files in module: 1
- Depends on feature modules: none
- Depends on groups: src/lib (1)
- Used by groups: Tests / Features (1), src/app / admin (1)
- Direct route users: none

## src/features / users
- Files in module: 1
- Depends on feature modules: shared (1), invitations (1)
- Depends on groups: src/features / shared (1), src/features / invitations (1)
- Used by groups: Tests / Features (1), src/app / admin (1)
- Direct route users: src/app/admin/users/page.tsx
