# Table: campaign_action_items

Generated from the current working tree on 2026-04-10 21:59:58.

- Category: Campaign / event / asset workflow
- Kinds: table
- Migrations: supabase/migrations/20260305004000_campaign_action_items.sql, supabase/migrations/20260306050000_campaign_action_item_sources.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Non-migration references: 19
- Referenced by groups: Tests / Features (6), src/app / admin (6), src/features / campaign-action-items (2), Root Files (1), src/features / agent-outcomes (1), src/features / conversations (1), src/features / dashboard (1), src/features / notifications (1)
- Routes: none
- Features: src/features/agent-outcomes/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/features/agent-outcomes/server.ts, src/features/campaign-action-items/server.ts, src/features/notifications/server.ts
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/clients/data.test.ts
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Behavior signals from references: server action/module (3), calls revalidatePath() (2)
- Auth signals from references: imports Clerk server auth (12), references membership/scope access concepts (7), calls currentUser() (3)

## Reference files
- __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, audit/architecture-smells.md, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/features/agent-outcomes/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
