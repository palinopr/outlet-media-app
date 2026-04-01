# Client Agent Local Worker Design

## Purpose

This document replaces the client `Agent` tab's hosted request-time model execution with a local-worker architecture that uses Jaime's local Claude runtime.

The goal is:

- clients keep using the same ChatGPT-style `Agent` tab in the web portal
- the web app becomes a durable queue and state surface only
- the actual model execution happens on Jaime's Mac through the existing local agent pattern
- the client-facing safety boundary remains strict and server-enforced

This is a runtime architecture change, not a product-surface expansion. The top-level client `Agent` tab remains read-only, client-safe, and attached to the same campaign/event reporting backbone.

## Product Outcome

After this refactor:

- client `Agent` messages are queued instead of answered inline inside the web request
- the chat shows a durable `Thinking…` state while a local worker is processing the turn
- the local worker on Jaime's Mac runs the Claude-based client-agent runtime
- the assistant reply is written back into the existing thread/message ledger
- clients keep seeing one-on-one chat behavior, but the execution host is local instead of Railway

The intended user feeling is:

- "It still feels like a normal chat."
- "It is working on my question."
- "It knows my campaigns and shows."
- "It does not expose Outlet's internal setup."

The feature should not feel like:

- a blocking API request waiting on a hosted model call
- a second internal admin assistant exposed to clients
- a live dashboard renderer pretending to be chat
- a fragile local localhost tunnel directly exposed to browsers

## Core Decisions

### 1. Move model execution off Railway and onto the local worker

The client portal should no longer execute the model during the `/messages` request.

Instead:

- the web app persists the user turn
- the web app queues durable work in `agent_tasks`
- the local worker claims and processes that work
- the worker writes the assistant turn back into the existing thread

This matches the existing local-agent pattern better than trying to make Railway impersonate Jaime's local Claude environment.

### 2. Keep the web app as the source of truth for chat state

The web app remains the durable source of truth for:

- thread creation
- message storage
- thread ownership and visibility
- client/member scope resolution
- pending/running/completed chat state visible to the UI

The local worker is only the execution plane for queued client-agent turns. It should not become a second parallel chat database.

### 3. Use the existing `agent_tasks` and `system_events` backbone

Do not invent a second queue system for client chat.

Reuse:

- `agent_tasks` for durable work requests
- `system_events` for visibility and audit
- the existing external-task polling pattern in the local agent runtime

This keeps the client-agent runtime on the same operational backbone as the other local agent workflows.

### 4. Keep the client-safe analytics boundary

This architecture change does not relax the data boundary.

The local worker may think freely, but it still must only see:

- the client's allowed campaigns
- the client's allowed events
- client-safe analytics tools and normalized reporting data

The client agent must still refuse or avoid exposing:

- ad set counts
- strategy
- account structure
- internal setup
- source-system plumbing
- admin-only workflow state

Allowed answers remain:

- Meta ads performance
- creatives
- demographics
- geography
- placements
- event/show performance
- comparative and trend questions

### 5. Default domain inference remains Meta ads first

When a business question is broad or vague, the agent should still default to lifetime Meta ads first unless the message clearly pivots to shows/events.

Examples:

- `how much have we spent`
- `how much have we made`
- `how are we doing`

Those should bias to Meta ads first.

Clear event cues such as `show`, `ticket`, `last show`, `sell through`, or `venue` should switch the runtime to event reasoning.

### 6. The chat needs durable pending state

Because replies are now asynchronous, `Thinking…` cannot live only in client-side React state.

Version 1 should make pending state durable by inserting an assistant placeholder message when the task is queued.

That gives the system:

- a reload-safe pending state
- a clear worker target to fill in later
- a simple way for the UI to know whether the current thread is still processing

This is preferable to an invisible pending task that disappears on reload.

## Runtime Architecture

## End-to-end flow

Each client-agent turn should run through this sequence:

1. client submits a message in the `Agent` tab
2. web API authenticates the viewer and resolves actual client/member scope
3. web API persists the user message in `client_agent_messages`
4. web API persists an assistant placeholder message with `response_status = 'pending'`
5. web API enqueues one durable `agent_task`
6. web API returns immediately with a queued response
7. UI shows `Thinking…` and polls the thread until the pending placeholder is resolved
8. local worker claims the task from `agent_tasks`
9. local worker reloads the thread, scope, and client-safe tool context
10. local worker runs Claude locally
11. local worker updates the pending placeholder message with the final assistant response
12. local worker marks the task complete or failed
13. UI reloads the thread and renders the final assistant message

## Transaction boundary

The web send path must not create half-written turns.

For each queued turn, these three writes must succeed or fail together:

- the user message insert
- the pending assistant placeholder insert
- the `agent_task` insert

Preferred implementation:

- one transactional server/store helper or database RPC that performs all three writes atomically

Fallback only if the app layer cannot make that atomic in one transaction:

- explicit compensating cleanup that deletes the partial user/assistant rows when task enqueue fails
- the route must still return failure, not a queued response, when the full bundle was not committed

There should never be a durable state where a queued assistant placeholder exists without its matching `agent_task`, or where a user turn exists without either a matching queued assistant placeholder or a returned request failure.

The send path also needs request-level idempotency.

If the browser retries the same submit because of timeout, reload, or duplicate send, the web app must not create a second user/assistant/task bundle for the same turn.

Version 1 should require one client-generated send idempotency key per submit and dedupe on:

- `threadId`
- `viewerContext`
- send idempotency key

If a duplicate request arrives with the same key:

- return the existing queued or completed bundle ids
- do not insert another user row
- do not insert another pending assistant placeholder
- do not enqueue another `agent_task`

## Surface split

### Web app responsibilities

The web app is responsible for:

- auth and scope checks
- client/member isolation
- durable thread and message state
- task enqueue
- pending-state exposure to the UI
- event logging

The web app is not responsible for:

- running Claude for client replies
- keeping a model session alive on Railway
- storing local Claude credentials

### Local worker responsibilities

The local worker is responsible for:

- claiming queued client-agent tasks
- loading the thread and client-safe analytics context
- running Claude locally
- writing the final assistant response back to the thread
- logging completion or failure

The local worker is not responsible for:

- determining who is allowed to see which thread
- acting as the primary thread store
- bypassing the client-safe analytics boundary

## Data model changes

## `client_agent_threads`

The current table is member-oriented and does not support persisted admin preview threads cleanly.

Version 1 should add explicit viewer context fields so both real client threads and admin preview test threads can live in the same durable ledger.

Add:

- `viewer_context text not null default 'member'`
- `preview_admin_user_id text null`

Rules:

- `viewer_context = 'member'`
  - `client_member_id` must be set
  - `preview_admin_user_id` must be null
- `viewer_context = 'admin_preview'`
  - `client_member_id` must be null
  - `preview_admin_user_id` must be set

This keeps admin preview threads durable but isolated from client-member threads.

### Thread summary rules

`client_agent_threads` remains the summary surface for the sidebar and active-thread shell, so queued and resolved turns must update it deterministically.

On queue:

- `last_response_status = 'pending'`
- `preview_text = 'Thinking…'`
- `last_message_at` reflects the queued turn timestamp so the active thread moves immediately in the sidebar
- `updated_at` reflects the queued turn

On assistant completion:

- `last_response_status` becomes the final assistant row status
- `preview_text` becomes a truncated version of the final assistant text
- `referenced_entities` mirrors the final assistant row's resolved entities when present
- `last_message_at` advances to the assistant completion timestamp so finished replies reorder like fresh chat activity
- `updated_at` reflects the completion write

On assistant failure:

- `last_response_status = 'error'`
- `preview_text` becomes a truncated safe failure message
- `last_message_at` advances to the assistant failure timestamp so the failed reply is still visible as the latest thread activity
- `updated_at` reflects the failure write

### Visibility rules

- members may only load threads where `viewer_context = 'member'` and `client_member_id` matches their member id
- admin preview may only load threads where `viewer_context = 'admin_preview'` and `preview_admin_user_id` matches the current admin user id

## `client_agent_messages`

The current `response_status` enum is not enough for asynchronous chat.

Version 1 should add:

- `pending` to the allowed `response_status` values
- `agent_task_id text null`
- `client_request_id text null`

`agent_task_id` is stored on the assistant placeholder row so:

- the worker can update the exact pending row deterministically
- the thread loader can expose whether a thread still has active queued work
- debugging and support do not require reverse-mapping from generic task params only

The final assistant update should replace the same placeholder row rather than inserting a second assistant message.

`client_request_id` is stored on the user message row for request-level idempotency. It lets the send path return the already-created queued turn when the browser retries the same submit.

Every queued turn must map:

- one user message
- one pending assistant placeholder
- one queued `agent_task`

The worker should always resolve that same placeholder row in place instead of creating a second assistant message for the same turn.

## `agent_tasks`

Reuse the existing table.

Use these values:

- `from_agent = 'client-portal'`
- `to_agent = 'client-agent'`
- `action = 'reply'`

`params` should include:

- `clientSlug`
- `threadId`
- `userMessageId`
- `assistantMessageId`
- `viewerContext`
- `clientMemberId` when applicable
- `previewAdminUserId` when applicable

The worker must still reload current scope and thread state instead of trusting this payload as authority.

## API contract changes

## `POST /api/client/[slug]/agent/threads/[threadId]/messages`

This route should stop returning a fully generated assistant answer for persisted threads.

For persisted threads it should:

- append the user message
- append the assistant placeholder with `status = pending`
- enqueue the `agent_task`
- return `202`

Suggested response body:

- `status: "queued"`
- `thread_id`
- `user_message_id`
- `assistant_message_id`
- `task_id`

The request body should also include one client-generated send idempotency key. The route must treat repeated submits with the same key as the same turn and return the previously created ids instead of creating duplicate rows or tasks.

This gives the client enough information to keep the local optimistic state consistent with the durable rows.

### Admin preview

Admin preview should also become durable and asynchronous in version 1.

That means:

- preview threads are persisted using `viewer_context = 'admin_preview'`
- preview sends also enqueue `client-agent` tasks
- preview remains isolated from member threads and not visible to clients

This removes the current in-memory preview special case that only works when the request waits for an immediate answer.

Admin preview lifecycle rules:

- a new preview chat creates a durable `client_agent_thread` row with `viewer_context = 'admin_preview'`
- preview threads appear in the same chat sidebar pattern for that admin while viewing the same client portal
- preview thread reloads come from storage, not in-memory session state
- preview threads are visible only to the admin whose `preview_admin_user_id` owns them
- preview threads never appear in member thread queries, member counts, or client-visible chat history

## `GET /api/client/[slug]/agent/threads/[threadId]`

This route should return:

- thread messages
- current placeholder rows
- enough information for the UI to know whether the active thread is still processing

Version 1 may derive that from:

- any assistant message with `response_status = 'pending'`

No separate status endpoint is required in version 1 if the thread detail already includes pending placeholder rows.

## UI behavior

The chat UI should stay ChatGPT-style and text-only.

It should change in these ways:

- sending a message no longer waits for a final answer body
- the optimistic user message remains as now
- the UI also receives or infers a pending assistant placeholder
- `Thinking…` should render whenever the active thread contains a pending assistant message
- the client should poll the active thread until the pending placeholder is replaced with a final status

Version 1 should use polling instead of realtime subscription.

Recommended polling behavior:

- start polling immediately after queue response
- poll every `1.5s` while the active thread has a pending assistant row
- stop when no pending assistant row remains
- if the thread unloads or the user switches threads, stop polling that thread

The chat stream should remain:

- prose-only
- no cards
- no charts
- no tables

## Worker execution design

## Queue integration

The local worker should reuse the existing external-task dispatcher pattern instead of introducing a second local poller.

Extend the dispatcher so it also claims:

- `from_agent = 'client-portal'`
- `to_agent = 'client-agent'`

That keeps client-agent work inside the same local worker process family as the other external work already running on Jaime's Mac.

## Task processor

Add a dedicated client-agent task processor in the local agent runtime.

Responsibilities:

- read task payload
- load the referenced thread and pending assistant placeholder
- reload real client/member scope
- build the client-safe tool environment
- run Claude locally
- update the pending placeholder row with:
  - final `response_status`
  - final `text`
  - final `referenced_entities`
  - final `context_payload`
  - final `resolved_range`
  - `provider_response_id` if available
- mark the task completed or failed

## Local Claude execution

The worker should use local Claude execution, not a hosted provider call.

Implementation may reuse the Claude SDK or Claude CLI runner pattern already used by the local agent process, but it must remain local-execution-only.

The runtime should preserve the current client-agent behavior expectations:

- normalized read-only tool surface
- lifetime default range
- Meta ads first for vague business questions
- event pivots on explicit show/ticket cues
- conversation follow-up context
- refusal for setup/strategy/structure/internal questions

The local worker may use the existing client-agent tool-runtime logic by extracting it into a shared server-only module that both the web app and the local worker can import, or by moving the client-agent reasoning runtime fully into the local worker package. What matters is:

- there is one authoritative client-agent reasoning/runtime implementation
- the web app does not keep a second hosted model path alive

## Failure and retry behavior

## Idempotency

Each queued turn should be idempotent by:

- `threadId`
- `userMessageId`
- `assistantMessageId`

The worker must treat a task as already satisfied if:

- the placeholder assistant row has already been resolved out of `pending`
- or the final result has already been written for that assistant message id

This avoids duplicate replies on worker restarts or retry races.

## Failure path

If local execution fails:

- the pending placeholder row should be updated to `response_status = 'error'`
- the text should be a brief safe failure message
- the `agent_task` should be marked `failed`
- the failure should be logged through the existing event/task status path

The UI should then render that assistant error row like any other chat response.

## Offline behavior

If Jaime's Mac is offline:

- the user message is still stored
- the assistant placeholder remains pending
- the task remains pending in `agent_tasks`
- the UI continues showing `Thinking…`

This is acceptable for version 1 because local execution availability is an intentional tradeoff of this architecture.

## Safety rules

The safety boundary stays the same as the planned client-agent tool-driven runtime:

- only assigned campaigns/events
- read-only normalized analytics tools
- creatives allowed
- demographics allowed
- geography and placements allowed
- no ad set counts
- no strategy disclosures
- no account structure
- no internal setup or source plumbing

The worker must not gain broader internal powers just because it runs locally.

## Testing requirements

Version 1 implementation must cover:

### Web/API tests

- persisted send path returns `queued` instead of a final answer
- send path creates user message plus pending assistant placeholder
- send path enqueues the correct `agent_task`
- thread detail surfaces pending placeholder rows correctly
- member thread isolation still holds
- admin preview thread isolation still holds

### Store tests

- placeholder assistant rows can be created with `pending`
- placeholder rows can be updated in place to final assistant responses
- preview-thread visibility rules work with new viewer-context fields

### Worker tests

- dispatcher claims `client-portal -> client-agent` tasks
- worker loads task/thread/scope and writes final assistant reply
- duplicate task execution does not duplicate replies
- worker failure resolves the placeholder to `error`

### End-to-end verification

- local client send queues work and returns immediately
- local worker writes the reply later
- UI stops showing `Thinking…` after completion
- reload during pending still shows `Thinking…`

## Rollout

Rollout should happen in this order:

1. ship schema support for durable preview threads and pending assistant rows
2. ship the web queued-send path
3. ship the local worker handler
4. run locally with the worker online
5. deploy the web app after the local worker is already capable of consuming the new task type

Do not remove the old inline hosted runtime until the queued local-worker path is working end to end in development.

## Non-goals

Version 1 does not need:

- realtime subscriptions
- a localhost HTTP bridge from browser to Mac
- a separate client-agent queue table
- multi-user local worker hosting across several machines
- a second top-level client workspace surface

The job is to convert the existing client chat into a durable queued local-worker flow on top of the current Outlet backbone.
