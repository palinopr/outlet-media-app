# Table: campaign_comments

Generated from the current working tree on 2026-04-10 17:55:29.

- Category: Campaign / event / asset workflow
- Kinds: table
- Migrations: supabase/migrations/20260306070000_campaign_comments.sql, supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Non-migration references: 17
- Referenced by groups: Tests / Features (5), src/app / admin (4), src/app / api (3), Root Files (1), src/features / campaign-comments (1), src/features / conversations (1), src/features / dashboard (1), src/features / notifications (1)
- Routes: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts
- Features: src/features/campaign-comments/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/api/campaign-comments/route.ts, src/features/notifications/server.ts
- Tests: __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts, src/app/api/campaign-comments/route.test.ts
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Behavior signals from references: calls revalidatePath() (2), server action/module (2)
- Auth signals from references: imports Clerk server auth (11), references membership/scope access concepts (8), calls currentUser() (4)

## Reference files
- __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, audit/architecture-smells.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/features/campaign-comments/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
