# Impact: src/lib/supabase.ts

Generated from the current working tree on 2026-04-10 21:37:00.

- Category: Shared web libraries
- Impact score: 373
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, … (+27 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, … (+73 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, … (+69 more)
- DB objects: none
- Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- Mutation symbols: createClerkSupabaseClient
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: none
- Depends on groups: none
- Used by groups: Tests / App, Tests / Features, Tests / Root, src/app / admin, src/app / api, src/app / client, src/features / agent-outcomes, src/features / approvals, src/features / asset-follow-up-items, src/features / assets, … (+15 more)
- Summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3
