# Impact: src/lib/api-schemas.ts

Generated from the current working tree on 2026-04-10 17:55:29.

- Category: Shared web libraries
- Impact score: 88
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/admin/actions/clients.ts, src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/ingest-tm-demographics.ts, … (+2 more)
- Tests related: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, __tests__/api/agents-heartbeat.test.ts, __tests__/api/agents.test.ts, __tests__/api/alerts.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/api/ingest.test.ts, src/app/shell-import-smoke.test.ts
- DB objects: none
- Env vars: none
- Mutation symbols: CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, CreateCampaignCommentSchema, CreateAssetCommentSchema, CreateEventCommentSchema
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: Tests / Lib, src/app / admin, src/app / api
- Summary: exports: IngestPayloadSchema, AlertPostSchema, AlertPatchSchema, VALID_AGENTS, AgentPostSchema, InviteSchema, CreateClientSchema, UpdateClientSchema; package imports: 1
