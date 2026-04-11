# Impact: agent/src/services/runtime-state-service.ts

Generated from the current working tree on 2026-04-10 21:51:44.

- Category: Agent services
- Impact score: 15
- Ownership: agent runtime service layer
- Feature module: none
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/runtime-state-service.test.ts
- Tests related: agent/src/services/runtime-state-service.test.ts, agent/src/events/message-handler.test.ts
- DB objects: agent_runtime_state
- Env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL
- Mutation symbols: startRuntimeHeartbeat, stopRuntimeHeartbeat
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: agent/src / discord, agent/src / services
- Summary: exports: writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat; package imports: 1
