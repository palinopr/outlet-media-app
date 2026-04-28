# Table: meta_campaigns

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: External ingest / reporting tables
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218130000_start_time.sql, supabase/migrations/20260304000000_campaign_type.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Non-migration references: 15
- Referenced by groups: src/app / admin (6), src/lib (4), Tests / API (1), Tests / App (1), Docs / References (1), src/app / api (1), src/app / client (1)
- Routes: none
- Features: none
- Shared libs: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts
- Docs: docs/references/database-safety-runbook.md
- Other mentions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts
- Behavior signals from references: server action/module (3), calls revalidatePath() (2)
- Auth signals from references: references membership/scope access concepts (5), imports Clerk server auth (4), calls currentUser() (2)

## Reference files
- __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, docs/references/database-safety-runbook.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
