# Table: ad_assets

Generated from the current working tree on 2026-04-10 21:51:44.

- Category: Other tables
- Kinds: table
- Migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 10
- Referenced by groups: src/app / admin (4), Tests / Features (2), Root Files (1), src/features / asset-follow-up-items (1), src/features / assets (1), src/features / conversations (1)
- Routes: none
- Features: src/features/asset-follow-up-items/server.ts, src/features/assets/server.ts, src/features/conversations/server.ts
- Shared libs: none
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/features/asset-follow-up-items/server.ts
- Tests: __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Behavior signals from references: calls revalidatePath() (1), server action/module (1)
- Auth signals from references: references membership/scope access concepts (6), imports Clerk server auth (5), calls currentUser() (1)

## Reference files
- __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, audit/architecture-smells.md, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/features/asset-follow-up-items/server.ts, src/features/assets/server.ts, src/features/conversations/server.ts
