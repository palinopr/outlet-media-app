# Impact: src/lib/supabase.ts

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Shared web libraries
- Impact score: 187
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, src/app/api/observability/client-error/route.ts, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, … (+9 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, … (+31 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/activity/route.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/features/campaigns/server.test.ts, … (+19 more)
- DB objects: if
- Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- Mutation symbols: createClerkSupabaseClient
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: none
- Depends on groups: none
- Used by groups: Tests / App, Tests / Features, Tests / Root, src/app / admin, src/app / api, src/app / client, src/features / campaigns, src/features / client-portal, src/features / invitations, src/features / system-events, … (+1 more)
- Summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3
