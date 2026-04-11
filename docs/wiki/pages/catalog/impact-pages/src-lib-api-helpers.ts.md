# Impact: src/lib/api-helpers.ts

Generated from the current working tree on 2026-04-10 21:51:44.

- Category: Shared web libraries
- Impact score: 185
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+16 more)
- Imported by: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.test.ts, … (+27 more)
- Tests related: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/actions/search.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, … (+10 more)
- DB objects: none
- Env vars: INGEST_SECRET
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: none
- Depends on groups: none
- Used by groups: Tests / API, src/app / admin, src/app / api, src/lib
- Summary: exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, getAuthorName; package imports: 3
