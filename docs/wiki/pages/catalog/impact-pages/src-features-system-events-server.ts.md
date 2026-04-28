# Impact: src/features/system-events/server.ts

Generated from the current working tree on 2026-04-28 02:57:59.

- Category: Feature files
- Impact score: 22
- Ownership: feature module: system-events
- Feature module: system-events
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: __tests__/features/system-events/list.test.ts, src/app/admin/actions/campaigns.ts
- Tests related: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: system_events, if
- Env vars: none
- Mutation symbols: logSystemEvent, LogSystemEventInput
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / admin
- Summary: exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent; internal imports: 1; package imports: 1
