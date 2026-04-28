# Impact: src/features/client-portal/entry.ts

Generated from the current working tree on 2026-04-28 02:57:59.

- Category: Feature files
- Impact score: 43
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts
- Tests related: src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx
- DB objects: clients, client_members, client_access_invites, if
- Env vars: none
- Mutation symbols: none
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / client, src/app / root routes, src/features / client-portal
- Summary: exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2
