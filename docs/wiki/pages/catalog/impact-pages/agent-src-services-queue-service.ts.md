# Impact: agent/src/services/queue-service.ts

Generated from the current working tree on 2026-04-10 21:37:00.

- Category: Agent services
- Impact score: 36
- Ownership: agent runtime service layer
- Feature module: none
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts
- Tests related: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- DB objects: agent_tasks, calls
- Env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL
- Mutation symbols: stopPersistedTaskPoller, enqueueTask, completeTask, failTask, approveTask, rejectTask, deferTask, startPersistedTaskPoller, startTask
- Auth signals: none
- Behavior signals: none
- Depends on groups: agent/src / services, agent/src / utils
- Used by groups: agent/src / discord, agent/src / services
- Summary: exports: setTaskExecutor, stopPersistedTaskPoller, pollPersistedTasksNow, initQueue, enqueueTask, completeTask, failTask, escalateTask; tests/describes: queued; started; completed; internal imports: 2; package imports: 2
