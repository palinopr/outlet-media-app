# Impact: agent/src/services/system-events-service.ts

Generated from the current working tree on 2026-04-10 22:12:57.

- Category: Agent services
- Impact score: 17
- Ownership: agent runtime service layer
- Feature module: none
- Route owners: none
- Imported by: agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts
- Tests related: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- DB objects: system_events
- Env vars: none
- Mutation symbols: logAgentSystemEvent, logDiscordAgentTurn, LogDiscordAgentTurnInput, startedAt
- Auth signals: none
- Behavior signals: none
- Depends on groups: agent/src / services, agent/src / utils
- Used by groups: agent/src / services
- Summary: exports: logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, listRecentAgentActivity, formatAgentActivityLine, buildAgentActivityDigest, safeLogAgentTaskRequested, safeLogAgentTaskStarted; internal imports: 2
