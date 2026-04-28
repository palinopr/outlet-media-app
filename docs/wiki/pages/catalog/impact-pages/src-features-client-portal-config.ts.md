# Impact: src/features/client-portal/config.ts

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Feature files
- Impact score: 16
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/client/[slug]/layout.tsx, src/features/client-portal/config.test.ts
- Tests related: src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts
- DB objects: clients, if
- Env vars: none
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / client, src/features / client-portal
- Summary: exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2
