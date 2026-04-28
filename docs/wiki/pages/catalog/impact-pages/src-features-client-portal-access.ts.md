# Impact: src/features/client-portal/access.ts

Generated from the current working tree on 2026-04-28 02:57:59.

- Category: Feature files
- Impact score: 19
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/features/client-portal/access.test.ts
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts
- DB objects: if
- Env vars: none
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser(), references membership/scope access concepts
- Behavior signals: calls redirect()
- Depends on groups: src/lib, src/features / client-portal
- Used by groups: src/app / client, src/features / client-portal
- Summary: exports: resolveClientPortalAccess, requireClientAccess; internal imports: 2; package imports: 2
