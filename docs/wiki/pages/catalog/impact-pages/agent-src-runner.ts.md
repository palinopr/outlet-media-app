# Impact: agent/src/runner.ts

Generated from the current working tree on 2026-04-10 16:45:57.

- Category: Agent runtime files
- Impact score: 18
- Ownership: agent runtime source
- Feature module: none
- Route owners: none
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts
- Tests related: agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts
- DB objects: none
- Env vars: CLAUDE_PATH
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: agent/src / utils
- Used by groups: agent/src / discord, agent/src / events, agent/src / root, agent/src / services
- Summary: exports: killAllClaude, runClaude, RUNNER_INACTIVITY_TIMEOUT_MS, RunnerOptions, RunnerResult; tests/describes: \n; internal imports: 1; package imports: 4
