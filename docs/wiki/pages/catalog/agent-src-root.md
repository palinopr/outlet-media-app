# agent/src / root

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 3
- File kinds: TypeScript module (2), test file (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `agent/src/index.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / root
- Ownership: agent runtime source
- Type: TypeScript module
- Construction: code module
- Lines: 107
- Bytes: 3545
- Imports (internal): agent/src/discord/core/entry.ts, agent/src/runner.ts, agent/src/utils/error-helpers.ts
- Imports (packages): node:child_process, node:fs
- Depends on groups: agent/src / discord, agent/src / root, agent/src / utils
- Symbol details: function readCommandForPid, function registerRuntimePid, function cleanupRuntimePid, function validateEnv, function shutdown, function gracefulExit, const agentRootDir, const sessionDir, const runtimePidFile
- Defines: readCommandForPid, registerRuntimePid, cleanupRuntimePid, validateEnv, shutdown, gracefulExit, agentRootDir, sessionDir, runtimePidFile, previousPid, command, registeredPid, … (+3 more)
- Tests / describe labels: SIGINT, SIGTERM, SIGHUP
- Contents summary: tests/describes: SIGINT; SIGTERM; SIGHUP; internal imports: 3; package imports: 2

## `agent/src/runner.test.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / root
- Ownership: agent runtime source
- Type: test file
- Construction: test specification
- Lines: 247
- Bytes: 8623
- Imports (internal): agent/src/runner.ts
- Imports (packages): vitest, node:child_process, node:stream, node:fs, node:url, dotenv/config
- Depends on groups: agent/src / root
- Symbol details: function makeFakeProc, function emitStreamJson, function emitStderr, const spawnMock
- Defines: makeFakeProc, emitStreamJson, emitStderr, spawnMock, actual, readFileSync, fileURLToPath, str, proc, mod, result, promise, … (+1 more)
- Tests / describe labels: data, runner, returns error when prompt file is missing, spawns claude with correct args for a new session, close, uses --resume flag when resumeSessionId is provided, uses direct system prompt when provided, calls onChunk for each text block, … (+4 more)
- Contents summary: tests/describes: data; runner; returns error when prompt file is missing; internal imports: 1; package imports: 6

## `agent/src/runner.ts`
- Status: tracked-clean
- System: agent
- Group: agent/src / root
- Ownership: agent runtime source
- Type: TypeScript module
- Construction: code module
- Lines: 276
- Bytes: 9682
- Imports (internal): agent/src/utils/error-helpers.ts
- Imports (packages): node:child_process, node:fs, node:url, node:path
- Imported by: agent/src/discord/core/entry.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts
- Depends on groups: agent/src / utils
- Used by groups: agent/src / discord, agent/src / events, agent/src / root, agent/src / services
- Tests related: agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts
- Tests related (direct): agent/src/events/message-handler.test.ts, agent/src/runner.test.ts, agent/src/services/web-task-executor.test.ts
- Exports: killAllClaude, runClaude, RUNNER_INACTIVITY_TIMEOUT_MS, RunnerOptions, RunnerResult
- Symbol details: function killAllClaude (exported), function runClaude (exported), function loadPrompt, const RUNNER_INACTIVITY_TIMEOUT_MS (exported), const __dirname, const AGENT_DIR, const PROMPTS_DIR, const CLAUDE_PATH, const activeProcs, interface RunnerOptions (exported), interface RunnerResult (exported)
- Defines: killAllClaude, loadPrompt, runClaude, __dirname, AGENT_DIR, PROMPTS_DIR, CLAUDE_PATH, activeProcs, path, RUNNER_INACTIVITY_TIMEOUT_MS, msg, baseArgs, … (+13 more)
- Tests / describe labels: \n
- Contents summary: exports: killAllClaude, runClaude, RUNNER_INACTIVITY_TIMEOUT_MS, RunnerOptions, RunnerResult; tests/describes: \n; internal imports: 1; package imports: 4
