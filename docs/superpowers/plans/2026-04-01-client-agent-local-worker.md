# Client Agent Local Worker Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the client portal `Agent` tab’s inline hosted model execution with a queued local-worker architecture that uses Jaime’s local Claude Agent SDK runtime while keeping the same client-safe reporting boundary.

**Architecture:** The Next.js app becomes the durable chat state, queue, and worker-gateway surface: it stores messages, enqueues `agent_tasks`, exposes secret-authenticated context/tool/resolve endpoints for the worker, and renders async pending chat state. The local `agent/` process claims `client-portal -> client-agent` tasks, runs Claude locally with the Agent SDK plus app-backed read-only tools, and posts final answers or failures back into the app’s thread/message ledger.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase/Postgres migrations + RPC, Vitest, Clerk, local `@anthropic-ai/claude-agent-sdk`, existing `agent_tasks` + `system_events` backbone

---

## File Structure

### App / queue / worker gateway

- Modify: `supabase/migrations/20260331160000_client_agent_tab.sql`
  - Reference only; do not edit. Use it to understand the current base table shape.
- Modify: `supabase/migrations/20260401173000_client_agent_context_payload.sql`
  - Reference only; do not edit. Use it to understand the current follow-up payload support.
- Create: `supabase/migrations/20260401210000_client_agent_local_worker.sql`
  - Add queued-turn schema changes: thread viewer fields, pending assistant fields, request-id support, and a transactional queue RPC.
- Modify: `src/lib/database.types.ts`
  - Regenerated DB types for the new thread/message columns and queue RPC.
- Modify: `src/lib/env.ts`
  - Remove client-agent OpenAI requirements and add server validation for the worker shared secret.
- Modify: `.env.example`
  - Document the local-worker secret and remove client-agent OpenAI vars from the app example.
- Create: `src/features/client-agent/queue.ts`
  - Atomic enqueue helper around the new DB RPC, plus queue-specific system-event logging inputs/outputs.
- Create: `src/features/client-agent/worker-api.ts`
  - Secret-authenticated server-side handlers that expose execution context, safe tools, and resolve/fail operations for the local worker.
- Modify: `src/features/client-agent/store.ts`
  - Support durable `admin_preview` threads, pending assistant placeholders, `agent_task_id`, `client_request_id`, and in-place placeholder resolution.
- Modify: `src/features/client-agent/store.test.ts`
  - Cover queue-oriented store behavior, durable preview isolation, and placeholder resolution.
- Modify: `src/features/client-agent/server.ts`
  - Stop running the model inline; create/list/get durable preview threads; queue turns and return `202 queued`.
- Modify: `src/features/client-agent/server.test.ts`
  - Assert queued send flow, durable preview behavior, and no inline model execution.
- Create: `src/app/api/internal/client-agent/tasks/[taskId]/context/route.ts`
  - Secret-authenticated worker context endpoint.
- Create: `src/app/api/internal/client-agent/tasks/[taskId]/context/route.test.ts`
  - Covers auth, task validation, and context payload shape.
- Create: `src/app/api/internal/client-agent/tools/route.ts`
  - Secret-authenticated tool execution endpoint that reuses the existing safe client-agent tools.
- Create: `src/app/api/internal/client-agent/tools/route.test.ts`
  - Covers auth, tool validation, refusal boundaries, and no-data behavior.
- Create: `src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.ts`
  - Secret-authenticated worker completion/failure endpoint.
- Create: `src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.test.ts`
  - Covers idempotent completion, failure updates, and thread summary refresh.
- Modify: `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts`
  - Accept request idempotency key and return `queued` response shape.
- Modify: `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts`
  - Covers `202 queued`, duplicate request dedupe, and pending placeholder exposure.
- Modify: `src/app/api/client/[slug]/agent/threads/route.ts`
  - No behavioral change beyond durable preview creation, but keep the route aligned with the new server contract.
- Modify: `src/app/api/client/[slug]/agent/threads/[threadId]/route.ts`
  - Ensure thread reads surface pending placeholders and persisted preview threads.

### Client UI

- Modify: `src/features/client-agent/components/agent-shell.tsx`
  - Replace inline answer handling with queued send + polling + persisted preview behavior.
- Modify: `src/features/client-agent/components/agent-shell.test.tsx`
  - Cover queued sends, polling stop conditions, preview persistence, and async error rendering.
- Modify: `src/features/client-agent/components/thread-list.tsx`
  - Ensure durable preview threads render in the sidebar like member threads but remain scoped to the current admin preview user.
- Modify: `src/features/client-agent/components/conversation-pane.tsx`
  - Keep `Thinking…` driven by pending assistant rows instead of transient local-only state.
- Modify: `src/app/client/[slug]/agent/page.tsx`
  - Ensure initial load works with persisted preview threads and no hosted runtime assumptions.
- Modify: `src/app/client/[slug]/agent/page.test.tsx`
  - Cover preview/member initial state after the async contract shift.

### Local worker

- Create: `agent/src/client-agent/app-client.ts`
  - HTTP client for the app’s secret-authenticated worker endpoints.
- Create: `agent/src/client-agent/app-client.test.ts`
  - Covers auth header, payload validation, and retry-safe app client behavior.
- Create: `agent/src/client-agent/runtime.ts`
  - Local Claude Agent SDK loop that receives thread context, exposes app-backed tools, and returns plain chat prose.
- Create: `agent/src/client-agent/runtime.test.ts`
  - Covers tool chaining, refusal propagation, Meta-ads-first defaulting, and event pivots.
- Create: `agent/src/client-agent/task-processor.ts`
  - Orchestrates one queued `client-agent` task: load context, run runtime, resolve/fail placeholder.
- Create: `agent/src/client-agent/task-processor.test.ts`
  - Covers idempotency, success, failure, and offline/retry-safe behavior.
- Modify: `agent/src/services/external-task-dispatcher.ts`
  - Claim `client-portal -> client-agent` tasks and route them to the new task processor.
- Create: `agent/src/services/external-task-dispatcher.test.ts`
  - Covers new dispatcher routing without regressing web-admin/gmail/whatsapp handling.

### Cleanup / docs

- Delete: `src/features/client-agent/model.ts`
- Delete: `src/features/client-agent/model.test.ts`
- Delete: `src/features/client-agent/runtime.ts`
- Delete: `src/features/client-agent/runtime.test.ts`
  - These files are the hosted inline model path and should not survive the local-worker cutover.
- Modify: `docs/context/current-priorities.md`
  - Capture the durable architectural lesson: client `Agent` now runs as a queued local-worker path, not a hosted request-time model call.

## Chunk 1: Queue-Backed App State

### Task 1: Add the queued local-worker database contract

**Files:**
- Create: `supabase/migrations/20260401210000_client_agent_local_worker.sql`
- Modify: `src/lib/database.types.ts`
- Modify: `src/lib/env.ts`
- Modify: `.env.example`
- Test: `src/features/client-agent/store.test.ts`

- [ ] **Step 1: Write the failing store/type expectations for the new schema**

Add or update tests so they assert the app expects:

```ts
expect(messageRow).toMatchObject({
  response_status: "pending",
  agent_task_id: expect.any(String),
  client_request_id: expect.any(String),
});

expect(threadRow).toMatchObject({
  viewer_context: "admin_preview",
  preview_admin_user_id: "user_admin",
});
```

- [ ] **Step 2: Run the focused test to verify the contract is missing**

Run: `npx vitest run src/features/client-agent/store.test.ts`

Expected: FAIL because the current schema/types do not expose `pending`, `agent_task_id`, `client_request_id`, or durable preview thread fields.

- [ ] **Step 3: Write the migration**

Implement `supabase/migrations/20260401210000_client_agent_local_worker.sql` with:

```sql
alter table public.client_agent_threads
  add column if not exists viewer_context text not null default 'member',
  add column if not exists preview_admin_user_id text null;

alter table public.client_agent_messages
  add column if not exists agent_task_id text null,
  add column if not exists client_request_id text null;
```

Also include:

- a check constraint for `viewer_context in ('member', 'admin_preview')`
- replacement of the `response_status` check to include `'pending'`
- indexes for preview thread lookup and request-id dedupe
- a `queue_client_agent_turn(...)` RPC that atomically inserts:
  - the user message
  - the pending assistant placeholder
  - the `agent_task`
  - and returns all created/existing ids for idempotent retries

- [ ] **Step 4: Regenerate DB types and wire env validation**

Update:

- `src/lib/database.types.ts` for the new columns/RPC
- `src/lib/env.ts` to remove `OPENAI_API_KEY` / `CLIENT_AGENT_OPENAI_MODEL` from the client-agent path and add `CLIENT_AGENT_WORKER_SECRET`
- `.env.example` to document `CLIENT_AGENT_WORKER_SECRET` and remove client-agent OpenAI vars

- [ ] **Step 5: Run the test to verify the schema-facing contract now passes**

Run: `npx vitest run src/features/client-agent/store.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260401210000_client_agent_local_worker.sql src/lib/database.types.ts src/lib/env.ts .env.example src/features/client-agent/store.test.ts
git commit -m "feat: add client agent local-worker schema contract"
```

### Task 2: Replace inline send persistence with queued store helpers

**Files:**
- Create: `src/features/client-agent/queue.ts`
- Modify: `src/features/client-agent/store.ts`
- Modify: `src/features/client-agent/store.test.ts`
- Modify: `src/features/client-agent/server.ts`
- Modify: `src/features/client-agent/server.test.ts`

- [ ] **Step 1: Write the failing tests for queued send behavior**

Add tests that assert:

```ts
expect(result).toMatchObject({
  ok: true,
  status: 202,
  body: {
    status: "queued",
    task_id: expect.any(String),
    assistant_message_id: expect.any(String),
  },
});

expect(appendAssistantMessage).not.toHaveBeenCalled();
expect(generateClientAgentModelResponse).not.toHaveBeenCalled();
```

Also add store-level tests for:

- durable `admin_preview` thread creation/list/get
- resolving a pending assistant placeholder in place
- duplicate `client_request_id` returning the same queued ids

- [ ] **Step 2: Run the focused tests to capture the current inline behavior**

Run: `npx vitest run src/features/client-agent/server.test.ts src/features/client-agent/store.test.ts`

Expected: FAIL because `sendMessage` still runs the model inline and preview threads are still in-memory only.

- [ ] **Step 3: Implement queue + store helpers**

In `src/features/client-agent/store.ts`:

- extend thread/message row types for the new columns
- make `createThread`, `listThreads`, and `getThread` work for both `member` and `admin_preview`
- add helpers to:
  - create or load preview threads
  - call the queue RPC
  - resolve/fail a pending assistant placeholder in place
  - refresh thread summary with `last_response_status`, `preview_text`, `referenced_entities`, `last_message_at`

In `src/features/client-agent/queue.ts`:

- wrap the queue RPC
- log `client_agent_user_message_submitted`
- log `agent_action_requested`
- return a normalized queued-turn result

In `src/features/client-agent/server.ts`:

- `sendMessage` should call the queue helper and return `202`
- preview sends should also persist a preview thread and queue a task instead of running the model inline
- remove all direct `generateClientAgentModelResponse(...)` usage

- [ ] **Step 4: Run the focused tests again**

Run: `npx vitest run src/features/client-agent/server.test.ts src/features/client-agent/store.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/client-agent/queue.ts src/features/client-agent/store.ts src/features/client-agent/store.test.ts src/features/client-agent/server.ts src/features/client-agent/server.test.ts
git commit -m "feat: queue client agent turns in app state"
```

### Task 3: Add app-backed worker context, tool, and resolve endpoints

**Files:**
- Create: `src/features/client-agent/worker-api.ts`
- Create: `src/app/api/internal/client-agent/tasks/[taskId]/context/route.ts`
- Create: `src/app/api/internal/client-agent/tasks/[taskId]/context/route.test.ts`
- Create: `src/app/api/internal/client-agent/tools/route.ts`
- Create: `src/app/api/internal/client-agent/tools/route.test.ts`
- Create: `src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.ts`
- Create: `src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.test.ts`
- Modify: `src/lib/api-helpers.ts`

- [ ] **Step 1: Write the failing route tests for the worker gateway**

Add route tests that assert:

```ts
expect(response.status).toBe(401); // missing/invalid worker secret
expect(body).toMatchObject({
  thread_id: "thread_1",
  assistant_message_id: "msg_assistant_pending",
  scope_summary: { client_slug: "acme", events_enabled: true },
});

expect(toolResponse).toMatchObject({
  status: "ok",
  data: expect.any(Object),
});
```

Also cover:

- invalid task id / wrong task type
- resolve success updates the pending placeholder in place
- resolve failure marks the placeholder `error`
- tool route never exposes structure/setup/system details beyond the safe tool surface

- [ ] **Step 2: Run the worker-gateway route tests to confirm they fail**

Run: `npx vitest run 'src/app/api/internal/client-agent/tasks/[taskId]/context/route.test.ts' 'src/app/api/internal/client-agent/tools/route.test.ts' 'src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.test.ts'`

Expected: FAIL because these routes/helpers do not exist yet.

- [ ] **Step 3: Implement the worker gateway**

In `src/lib/api-helpers.ts`:

- add a dedicated worker-secret helper, e.g.:

```ts
export function clientAgentWorkerGuard(secret: unknown): Response | null {
  if (!process.env.CLIENT_AGENT_WORKER_SECRET || secret !== process.env.CLIENT_AGENT_WORKER_SECRET) {
    return apiError("Unauthorized", 401);
  }
  return null;
}
```

In `src/features/client-agent/worker-api.ts`:

- `getTaskContext(taskId)` should:
  - validate `agent_task`
  - reload actual thread + placeholder + user message + viewer scope
  - return a worker-safe execution bundle
- `runTool(name, args)` should dispatch only through the existing client-agent tool modules
- `resolveTask(taskId, result)` should update the placeholder and thread summary, then emit the correct system event

Keep this file focused on worker-facing orchestration so the route files stay thin.

- [ ] **Step 4: Run the worker-gateway route tests again**

Run: `npx vitest run 'src/app/api/internal/client-agent/tasks/[taskId]/context/route.test.ts' 'src/app/api/internal/client-agent/tools/route.test.ts' 'src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.test.ts'`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/api-helpers.ts src/features/client-agent/worker-api.ts src/app/api/internal/client-agent/tasks/[taskId]/context/route.ts src/app/api/internal/client-agent/tasks/[taskId]/context/route.test.ts src/app/api/internal/client-agent/tools/route.ts src/app/api/internal/client-agent/tools/route.test.ts src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.ts src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.test.ts
git commit -m "feat: add client agent worker gateway routes"
```

## Chunk 2: Async Client Chat UX

### Task 4: Convert the client portal chat to queued sends and polling

**Files:**
- Modify: `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts`
- Modify: `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts`
- Modify: `src/app/api/client/[slug]/agent/threads/[threadId]/route.ts`
- Modify: `src/app/api/client/[slug]/agent/threads/route.ts`
- Modify: `src/features/client-agent/components/agent-shell.tsx`
- Modify: `src/features/client-agent/components/agent-shell.test.tsx`
- Modify: `src/features/client-agent/components/thread-list.tsx`
- Modify: `src/features/client-agent/components/conversation-pane.tsx`
- Modify: `src/app/client/[slug]/agent/page.tsx`
- Modify: `src/app/client/[slug]/agent/page.test.tsx`

- [ ] **Step 1: Write the failing UI/route tests for async behavior**

Add tests that assert:

```ts
expect(body).toMatchObject({
  status: "queued",
  task_id: expect.any(String),
});

expect(screen.getByText("Thinking…")).toBeInTheDocument();
expect(fetchMock).toHaveBeenCalledWith(
  expect.stringContaining(`/api/client/acme/agent/threads/${threadId}`),
  expect.anything(),
);
```

Also cover:

- preview threads persist and reload for the same admin user
- polling stops when the assistant row leaves `pending`
- polling is cancelled when the user switches threads or the shell unmounts
- duplicate send retry with the same request id does not duplicate optimistic rows
- thread list reorders on queue and completion timestamps

- [ ] **Step 2: Run the focused UI/route tests to verify the old inline contract fails**

Run: `npx vitest run 'src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts' src/features/client-agent/components/agent-shell.test.tsx src/app/client/[slug]/agent/page.test.tsx`

Expected: FAIL because the route still expects immediate answers and the shell appends final assistant rows directly.

- [ ] **Step 3: Implement the async client contract**

In `messages/route.ts`:

- replace `history` input with a required/optional `client_request_id`
- forward only the queue contract to `sendMessage`

In `agent-shell.tsx`:

- generate one `client_request_id` per submit
- keep optimistic user message behavior
- stop fabricating the assistant answer from the POST response
- mark the thread as pending and start polling `GET /threads/[threadId]`
- merge the durable server rows back into the local state when the placeholder resolves
- cancel the active poll loop on thread switch and component unmount so stale responses cannot overwrite a different active thread

In `thread-list.tsx` / `conversation-pane.tsx`:

- drive `Thinking…` from pending assistant rows
- keep preview threads visible in the sidebar for the owning admin preview user

In `page.tsx`:

- ensure initial fetch/load path supports persisted preview threads instead of empty in-memory preview state

- [ ] **Step 4: Run the focused UI/route tests again**

Run: `npx vitest run 'src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts' src/features/client-agent/components/agent-shell.test.tsx src/app/client/[slug]/agent/page.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts src/app/api/client/[slug]/agent/threads/[threadId]/route.ts src/app/api/client/[slug]/agent/threads/route.ts src/features/client-agent/components/agent-shell.tsx src/features/client-agent/components/agent-shell.test.tsx src/features/client-agent/components/thread-list.tsx src/features/client-agent/components/conversation-pane.tsx src/app/client/[slug]/agent/page.tsx src/app/client/[slug]/agent/page.test.tsx
git commit -m "feat: make client agent chat async and durable"
```

## Chunk 3: Local Claude Worker

### Task 5: Build the app client and local Claude Agent SDK runtime

**Files:**
- Create: `agent/src/client-agent/app-client.ts`
- Create: `agent/src/client-agent/app-client.test.ts`
- Create: `agent/src/client-agent/runtime.ts`
- Create: `agent/src/client-agent/runtime.test.ts`

- [ ] **Step 1: Write the failing worker app-client/runtime tests**

Add tests that assert:

```ts
expect(fetch).toHaveBeenCalledWith(
  expect.stringContaining("/api/internal/client-agent/tasks/task_1/context"),
  expect.objectContaining({
    headers: expect.objectContaining({
      Authorization: "Bearer worker_secret",
    }),
  }),
);

expect(result).toMatchObject({
  status: "answer",
  text: expect.any(String),
});
```

Also cover:

- tool call payloads go through the app-backed `/tools` route
- Meta-ads-first defaulting for vague business questions
- event pivot when the context/task says `last show` / `ticket`
- refusal passthrough for setup/strategy/structure asks

- [ ] **Step 2: Run the focused worker tests to confirm they fail**

Run: `cd agent && npx vitest run src/client-agent/app-client.test.ts src/client-agent/runtime.test.ts`

Expected: FAIL because the local client-agent worker modules do not exist yet.

- [ ] **Step 3: Implement the local app client and SDK runtime**

In `agent/src/client-agent/app-client.ts`:

- add a small fetch wrapper around:
  - `GET /api/internal/client-agent/tasks/:taskId/context`
  - `POST /api/internal/client-agent/tools`
  - `POST /api/internal/client-agent/tasks/:taskId/resolve`
- source base URL from `NEXT_PUBLIC_APP_URL` (or a dedicated agent-facing override if already used elsewhere)
- source auth from `CLIENT_AGENT_WORKER_SECRET`

In `agent/src/client-agent/runtime.ts`:

- build the Claude Agent SDK loop using the local settings pattern from `creative-classify.ts`
- expose only the allowed app-backed tools
- collect final assistant text only; no block payloads
- keep the runtime pure so it returns a normalized `{ status, text, referencedEntities, contextPayload, resolvedRange }`

Example runtime shape:

```ts
for await (const _event of query({
  prompt,
  options: {
    cwd: AGENT_DIR,
    settingSources: ["local"],
    systemPrompt,
    mcpServers: { "client-agent-tools": sdkServer },
    allowedTools,
    maxTurns: 8,
  },
})) {
  // drive local Claude loop to completion
}
```

- [ ] **Step 4: Run the focused worker tests again**

Run: `cd agent && npx vitest run src/client-agent/app-client.test.ts src/client-agent/runtime.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add agent/src/client-agent/app-client.ts agent/src/client-agent/app-client.test.ts agent/src/client-agent/runtime.ts agent/src/client-agent/runtime.test.ts
git commit -m "feat: add local client agent runtime"
```

### Task 6: Wire the queued task processor into the external dispatcher

**Files:**
- Create: `agent/src/client-agent/task-processor.ts`
- Create: `agent/src/client-agent/task-processor.test.ts`
- Modify: `agent/src/services/external-task-dispatcher.ts`
- Create: `agent/src/services/external-task-dispatcher.test.ts`

- [ ] **Step 1: Write the failing task-processor/dispatcher tests**

Add tests that assert:

```ts
expect(processClientAgentTask).toHaveBeenCalledWith(
  expect.objectContaining({
    from_agent: "client-portal",
    to_agent: "client-agent",
  }),
);

expect(resolveTask).toHaveBeenCalledWith(
  "task_1",
  expect.objectContaining({ status: "answer" }),
);
```

Also cover:

- already-resolved placeholder => processor exits idempotently
- runtime failure => resolve route receives an `error` result
- dispatcher still handles `web-admin`, `gmail-push`, and `whatsapp-cloud`

- [ ] **Step 2: Run the focused agent tests to capture the missing dispatcher support**

Run: `cd agent && npx vitest run src/client-agent/task-processor.test.ts src/services/external-task-dispatcher.test.ts`

Expected: FAIL because the dispatcher ignores `client-portal` tasks today.

- [ ] **Step 3: Implement the task processor and dispatcher integration**

In `agent/src/client-agent/task-processor.ts`:

- fetch context from the app client
- short-circuit if the placeholder is already resolved
- run the local Claude runtime
- call the resolve endpoint with either:
  - final assistant answer/refusal/clarify
  - or safe error result

In `agent/src/services/external-task-dispatcher.ts`:

- extend `isExternalTask(...)`, task claiming, and `executeTask(...)` to accept:
  - `from_agent = 'client-portal'`
  - `to_agent = 'client-agent'`
- keep existing task families untouched

- [ ] **Step 4: Run the focused agent tests again**

Run: `cd agent && npx vitest run src/client-agent/task-processor.test.ts src/services/external-task-dispatcher.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add agent/src/client-agent/task-processor.ts agent/src/client-agent/task-processor.test.ts agent/src/services/external-task-dispatcher.ts agent/src/services/external-task-dispatcher.test.ts
git commit -m "feat: dispatch client portal agent tasks locally"
```

## Chunk 4: Cleanup, Cutover, and Verification

### Task 7: Remove the hosted runtime path and lock the local-worker contract

**Files:**
- Delete: `src/features/client-agent/model.ts`
- Delete: `src/features/client-agent/model.test.ts`
- Delete: `src/features/client-agent/runtime.ts`
- Delete: `src/features/client-agent/runtime.test.ts`
- Modify: `src/features/client-agent/tool-contracts.ts`
- Modify: `src/features/client-agent/tool-contracts.test.ts`
- Modify: `src/features/client-agent/tools/index.ts`
- Modify: `docs/context/current-priorities.md`

- [ ] **Step 1: Write the failing cleanup/contract assertions**

Add or update tests to assert:

- no client-facing server path imports `generateClientAgentModelResponse`
- no `OPENAI_API_KEY` / `CLIENT_AGENT_OPENAI_MODEL` references remain in the client-agent web path
- tool gateway still exposes the expected tool names after the hosted runtime files are removed

- [ ] **Step 2: Run the focused cleanup tests**

Run: `npx vitest run src/features/client-agent/tool-contracts.test.ts src/features/client-agent/store.test.ts src/features/client-agent/server.test.ts`

Expected: FAIL if any hosted runtime imports or stale tool exports remain.

- [ ] **Step 3: Delete the dead hosted runtime path and update durable docs**

- remove `model.ts` / `runtime.ts` and their tests
- trim any stale imports/exports that only existed for the hosted runtime
- update `docs/context/current-priorities.md` with the local-worker client-agent architecture lesson

- [ ] **Step 4: Run the full targeted verification suite**

Run:

```bash
npx vitest run src/features/client-agent/store.test.ts src/features/client-agent/server.test.ts 'src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts' 'src/app/api/internal/client-agent/tasks/[taskId]/context/route.test.ts' 'src/app/api/internal/client-agent/tools/route.test.ts' 'src/app/api/internal/client-agent/tasks/[taskId]/resolve/route.test.ts' src/features/client-agent/components/agent-shell.test.tsx src/app/client/[slug]/agent/page.test.tsx
cd agent && npx vitest run src/client-agent/app-client.test.ts src/client-agent/runtime.test.ts src/client-agent/task-processor.test.ts src/services/external-task-dispatcher.test.ts
cd /Users/jaimeortiz/outlet-media-app/.worktrees/client-agent-local-worker && npx eslint src/features/client-agent src/app/api/client/[slug]/agent src/app/api/internal/client-agent src/app/client/[slug]/agent src/lib/env.ts src/lib/api-helpers.ts
cd /Users/jaimeortiz/outlet-media-app/.worktrees/client-agent-local-worker && npm run type-check
```

Expected:

- all targeted Vitest suites PASS
- ESLint exits 0
- `npm run type-check` exits 0

- [ ] **Step 5: Commit**

```bash
git add docs/context/current-priorities.md src/features/client-agent/tool-contracts.ts src/features/client-agent/tool-contracts.test.ts src/features/client-agent/tools/index.ts src/features/client-agent/store.test.ts src/features/client-agent/server.test.ts
git rm src/features/client-agent/model.ts src/features/client-agent/model.test.ts src/features/client-agent/runtime.ts src/features/client-agent/runtime.test.ts
git commit -m "refactor: cut client agent over to local worker"
```
