# Agent Simplification Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 11 persona-based agents with a single operations agent — one prompt, no cron, no delegation.

**Architecture:** All Discord messages route to one agent prompt via a simplified router. Claude CLI spawns per-message with 10 messages of Discord history as context. Agent reads/writes MEMORY.md for persistent context.

**Tech Stack:** Discord.js, Claude CLI (via runner.ts), Meta Graph API, Gmail/Calendar session scripts, Supabase REST.

**Spec:** `docs/superpowers/specs/2026-04-03-agent-simplification-design.md`

---

## Chunk 1: Core Replacement

### Task 1: Write the single agent prompt

**Files:**
- Modify: `agent/prompts/agent.txt` (already exists from prototype, needs MEMORY.md write instruction)

- [ ] **Step 1: Update agent.txt with MEMORY.md write instruction**

Add after the Rules section:

```
## Memory

Before answering any message, read MEMORY.md for current context.

When you learn something important (strategy change, budget decision, client update, new contact, deadline), update MEMORY.md with a short entry. Keep it concise — bullet points, not paragraphs.
```

- [ ] **Step 2: Verify prompt is complete**

Check that agent.txt has all sections: identity, credentials, Meta Ads, Email, Calendar, Database, client aliases, rules, memory, data conventions.

- [ ] **Step 3: Commit**

```bash
git add agent/prompts/agent.txt
git commit -m "feat(agent): write single unified agent prompt"
```

---

### Task 2: Replace router

**Files:**
- Modify: `agent/src/discord/core/router.ts`

- [ ] **Step 1: Replace router.ts with simplified version**

Replace entire file with:

```typescript
export interface AgentConfig {
  promptFile: string;
  maxTurns: number;
  description: string;
  readOnly?: boolean;
}

const AGENT: AgentConfig = {
  promptFile: "agent",
  maxTurns: 25,
  description: "outlet-agent",
};

const READ_ONLY: AgentConfig = {
  promptFile: "agent",
  maxTurns: 5,
  description: "read-only",
  readOnly: true,
};

const READ_ONLY_CHANNELS = new Set([
  "agent-feed",
  "morning-briefing",
  "email-log",
  "approvals",
  "audit-log",
]);

export function getAgentForChannel(channelName: string): AgentConfig {
  if (READ_ONLY_CHANNELS.has(channelName)) return READ_ONLY;
  return AGENT;
}

export function hasAgentRoute(): boolean {
  return true;
}

export function isInternalChannel(): boolean {
  return false;
}

export function isConfigChannel(): boolean {
  return false;
}
```

- [ ] **Step 2: Commit**

```bash
git add agent/src/discord/core/router.ts
git commit -m "refactor(agent): simplify router to single agent"
```

---

### Task 3: Simplify message handler

**Files:**
- Modify: `agent/src/events/message-handler.ts`

- [ ] **Step 1: Replace message-handler.ts**

Strip out: delegation processing, resource locks, per-agent memory sync, per-agent skills sync, agent activity logging. Keep: conversation context building, Claude CLI invocation, response delivery via webhook with fallback to message edit, channel lock (prevent concurrent processing per channel), typing indicator.

Key changes:
- Remove imports: `delegate.js`, `memory.js`, `skills.js`, `agent-resource-locks.js`, `system-events-service.js`, `state.js`
- Remove `buildSystemPrompt()` (no snapshot injection, no memory merge — agent reads MEMORY.md itself)
- Remove `postProcess()` (no memory sync, no skills sync, no activity logging)
- Remove `logActivity()`
- Remove `withResourceLocks` wrapper
- Simplify `handleMessage()` to: lock channel → build context → runClaude → deliver response → unlock

- [ ] **Step 2: Run type-check**

```bash
cd agent && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add agent/src/events/message-handler.ts
git commit -m "refactor(agent): simplify message handler — no delegation, no memory sync"
```

---

### Task 4: Simplify index.ts

**Files:**
- Modify: `agent/src/index.ts`

- [ ] **Step 1: Replace index.ts**

Remove: `startScheduler`, `stopScheduler`, `stopStatus`, `stopExternalTaskDispatcher`, `stopApprovals` imports and calls. Keep: orphan process cleanup, env validation, Discord bot startup, graceful shutdown (killAllClaude + discordClient.destroy).

- [ ] **Step 2: Run type-check**

```bash
cd agent && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add agent/src/index.ts
git commit -m "refactor(agent): simplify startup — no scheduler, no services"
```

---

### Task 5: Simplify slash commands

**Files:**
- Modify: `agent/src/discord/commands/slash.ts`

- [ ] **Step 1: Strip slash.ts to 3 commands**

Keep only `/status`, `/help`, `/reset`. Remove: `/supervise`, `/ops`, `/dashboard`, `/schedule`, `/schedule-budget`, `/schedule-copy-swap`, `/roles`, `/threads`, `/publish-confirm`, `/publish-fail`.

Update `/help` response text to reflect the simplified agent (no sweep commands, no bang commands, no multi-agent).

- [ ] **Step 2: Run type-check**

```bash
cd agent && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add agent/src/discord/commands/slash.ts
git commit -m "refactor(agent): keep only /status, /help, /reset slash commands"
```

---

## Chunk 2: Delete Dead Code

### Task 6: Delete old prompts, memory, skills

**Files:**
- Delete: `agent/prompts/boss.txt`, `agent/prompts/media-buyer.txt`, `agent/prompts/tm-agent.txt`, `agent/prompts/reporting-agent.txt`, `agent/prompts/think.txt`, `agent/prompts/creative-agent.txt`, `agent/prompts/client-manager.txt`, `agent/prompts/email-agent.txt`, `agent/prompts/don-omar-agent.txt`, `agent/prompts/meeting-agent.txt`, `agent/prompts/general.txt`, `agent/prompts/command.txt`, `agent/prompts/growth-supervisor.txt`, `agent/prompts/content-finder.txt`, `agent/prompts/lead-qualifier.txt`, `agent/prompts/publisher-tiktok.txt`, `agent/prompts/tiktok-supervisor.txt`
- Delete: `agent/memory/` (entire directory, 15 files)
- Delete: `agent/skills/` (entire directory, 13 subdirectories)

- [ ] **Step 1: Delete files**

```bash
cd agent
# Delete old prompts (keep agent.txt)
ls prompts/*.txt | grep -v agent.txt | xargs rm
# Delete per-agent memory and skills
rm -rf memory/ skills/
```

- [ ] **Step 2: Commit**

```bash
git add -A agent/prompts/ agent/memory/ agent/skills/
git commit -m "refactor(agent): delete 17 old prompts, per-agent memory and skills"
```

---

### Task 7: Delete dead source files

**Files:**
- Delete: `agent/src/scheduler.ts`
- Delete: `agent/src/jobs/cron-sweeps.ts`, `agent/src/jobs/creative-classify.ts`
- Delete: `agent/src/agents/delegate.ts`, `agent/src/agents/spawner.ts`
- Delete: `agent/src/events/trigger-handler.ts`, `agent/src/events/inspect-handler.ts`
- Delete: `agent/src/discord/core/command-router.ts`
- Delete: `agent/src/discord/commands/admin.ts`, `agent/src/discord/commands/schedule.ts`, `agent/src/discord/commands/dashboard.ts`, `agent/src/discord/commands/ops.ts`, `agent/src/discord/commands/supervisor.ts`, `agent/src/discord/commands/growth-publish.ts`
- Delete: `agent/src/discord/features/buttons.ts`, `agent/src/discord/features/memory.ts`, `agent/src/discord/features/skills.ts`, `agent/src/discord/features/threads.ts`, `agent/src/discord/features/restructure.ts`
- Delete: `agent/src/services/approval-service.ts`, `agent/src/services/status-service.ts`, `agent/src/services/agent-resource-locks.ts`, `agent/src/services/external-task-dispatcher.ts`
- Delete: `agent/src/services/owner-discord-service.ts`
- Delete: `agent/src/services/scheduled-handoff-service.ts`, `agent/src/services/meta-copy-swap-service.ts`
- Delete: `agent/src/growth/contracts.ts`
- Delete: `agent/src/services/growth-ledger-types.ts`, `agent/src/services/growth-ledger-read.ts`, `agent/src/services/growth-ledger-write.ts`, `agent/src/services/ledger-service.ts`
- Delete: `agent/src/discord/core/access.ts`, `agent/src/discord/core/message-prompt.ts`

- [ ] **Step 1: Delete source files**

```bash
cd agent/src
rm -f scheduler.ts
rm -rf jobs/
rm -f agents/delegate.ts agents/spawner.ts
rm -f events/trigger-handler.ts events/inspect-handler.ts
rm -f discord/core/command-router.ts discord/core/access.ts discord/core/message-prompt.ts
rm -f discord/commands/admin.ts discord/commands/schedule.ts discord/commands/dashboard.ts discord/commands/ops.ts discord/commands/supervisor.ts discord/commands/growth-publish.ts
rm -rf discord/features/
rm -f services/approval-service.ts services/status-service.ts services/agent-resource-locks.ts services/external-task-dispatcher.ts
rm -f services/owner-discord-service.ts services/scheduled-handoff-service.ts services/meta-copy-swap-service.ts
rm -f growth/contracts.ts
rm -f services/growth-ledger-types.ts services/growth-ledger-read.ts services/growth-ledger-write.ts services/ledger-service.ts
```

- [ ] **Step 2: Delete empty directories**

```bash
find agent/src -type d -empty -delete
```

- [ ] **Step 3: Commit**

```bash
git add -A agent/src/
git commit -m "refactor(agent): delete scheduler, delegation, sweeps, growth, and dead services"
```

---

### Task 8: Delete dead test files

**Files:**
- Delete all test files for deleted modules

- [ ] **Step 1: Delete test files for removed code**

```bash
cd agent/src
rm -f scheduler.test.ts
rm -f agents/delegate.test.ts
rm -f discord/core/command-router.test.ts discord/core/message-prompt.test.ts
rm -f discord/commands/ops.test.ts discord/commands/growth-publish.test.ts
rm -f services/email-classify.test.ts services/queue-service.test.ts services/scheduled-handoff-service.test.ts services/meta-copy-swap-service.test.ts
rm -f events/message-handler.test.ts
rm -f runner.test.ts
```

Wait — check which tests still apply. `runner.test.ts` tests the Claude CLI spawner which we're keeping. `queue-service.test.ts` tests queue-service which we're keeping. `email-classify.test.ts` tests email classification which may still be used.

**Before deleting, verify:** `grep -rn` each test's import source to confirm the source file is deleted.

- [ ] **Step 2: Run type-check and tests**

```bash
cd agent && npx tsc --noEmit
cd .. && npm test
```

- [ ] **Step 3: Commit**

```bash
git add -A agent/
git commit -m "refactor(agent): delete tests for removed modules"
```

---

### Task 9: Clean up prototype files

**Files:**
- Delete: `agent/src/index-v2.ts`
- Delete: `agent/src/discord/core/router-v2.ts`
- Delete: `agent/src/events/message-handler-v2.ts`

- [ ] **Step 1: Delete v2 prototype files**

```bash
rm -f agent/src/index-v2.ts agent/src/discord/core/router-v2.ts agent/src/events/message-handler-v2.ts
```

- [ ] **Step 2: Commit**

```bash
git add -A agent/src/
git commit -m "chore(agent): remove v2 prototype files"
```

---

## Chunk 3: Verify & Ship

### Task 10: Final verification

- [ ] **Step 1: Run agent type-check**

```bash
cd agent && npx tsc --noEmit
```

Fix any remaining import errors from deleted files.

- [ ] **Step 2: Run web type-check**

```bash
npm run type-check
```

- [ ] **Step 3: Run web tests**

```bash
npm test
```

- [ ] **Step 4: Verify file count reduction**

```bash
find agent/src -type f -name '*.ts' | wc -l
# Should be significantly less than the original 62
```

- [ ] **Step 5: Verify prompt count**

```bash
ls agent/prompts/
# Should show only agent.txt
```

- [ ] **Step 6: Push and deploy**

```bash
git push origin main
railway up --detach
```
