# Impact: src/lib/api-helpers.ts

Generated from the current working tree on 2026-04-28 02:30:43.

- Category: Shared web libraries
- Impact score: 88
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/api/observability/client-error/route.ts, src/app/api/user/profile/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/layout.tsx, src/app/admin/users/page.tsx, … (+1 more)
- Imported by: src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/ingest-meta-campaigns.ts, … (+5 more)
- Tests related: src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/actions/search.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: if
- Env vars: INGEST_SECRET
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/app / admin, src/app / api, src/lib
- Summary: exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest; package imports: 3
