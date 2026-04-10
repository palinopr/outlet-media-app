# Table: event_follow_up_items

Generated from the current working tree on 2026-04-10 17:55:29.

- Category: Campaign / event / asset workflow
- Kinds: table
- Migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Non-migration references: 13
- Referenced by groups: Tests / Features (6), src/app / admin (2), src/features / agent-outcomes (1), src/features / conversations (1), src/features / event-follow-up-items (1), src/features / events (1), src/features / notifications (1)
- Routes: none
- Features: src/features/agent-outcomes/server.ts, src/features/conversations/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/features/agent-outcomes/server.ts, src/features/event-follow-up-items/server.ts, src/features/notifications/server.ts
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts
- Behavior signals from references: server action/module (2), calls revalidatePath() (1)
- Auth signals from references: imports Clerk server auth (7), references membership/scope access concepts (5), calls currentUser() (2)

## Reference files
- __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/features/agent-outcomes/server.ts, src/features/conversations/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
