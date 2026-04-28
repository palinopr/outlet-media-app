# Impact: src/lib/api-schemas.ts

Generated from the current working tree on 2026-04-28 02:32:49.

- Category: Shared web libraries
- Impact score: 48
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/admin/actions/clients.ts, src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/route.ts
- Tests related: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/shell-import-smoke.test.ts
- DB objects: if
- Env vars: none
- Mutation symbols: CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: Tests / Lib, src/app / admin, src/app / api
- Summary: exports: IngestPayloadSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, ContactFormSchema; package imports: 1
