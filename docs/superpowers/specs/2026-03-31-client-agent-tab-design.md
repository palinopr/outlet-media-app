# Client Agent Tab Design

## Purpose

This document defines a new client-facing `Agent` tab in the client portal.

The goal is to give clients a ChatGPT-style way to ask questions about their campaigns and optional events without exposing Outlet's internal structure, source systems, raw identifiers, admin-only workflow state, or implementation details.

This is a client portal feature, not a general-purpose assistant and not a reuse of the internal admin `assistant` surface.

## Product Outcome

After this work:

- client portal navigation includes `Agent`
- clients can open a chat-style page and ask questions in natural language
- the assistant answers only from allowlisted client-safe analytics for that client
- answers can summarize, compare, and explain trends across campaigns and events within the user's allowed scope
- the assistant refuses questions about internals, hidden structure, raw source systems, or data outside the client's allowed scope

The finished feature should feel like:

- "ChatGPT for my campaigns and events"
- a guided analytics assistant
- a safe client-facing interpretation layer over already approved reporting data

It should not feel like:

- a generic bot with broad product knowledge
- a support chatbot
- a portal into raw backend objects
- a client-facing copy of the admin `Agents` page

## Core Decisions

### 1. `Agent` is a first-class client tab

`Agent` ships as a top-level client portal tab alongside the existing narrow client shell.

It should appear in both:

- desktop client navigation
- mobile client navigation

The tab label is explicitly `Agent`.

### 2. ChatGPT-style UX, narrow analytics scope

The user experience should feel conversational and flexible, but the underlying data scope must stay narrow and explicit.

The assistant may answer:

- campaign performance questions
- event performance questions when events are enabled
- trend and comparison questions
- simple summary and explanation questions grounded in the available metrics

The assistant may not answer:

- internal architecture questions
- admin-only workflow questions
- source system questions
- raw ID or account-structure questions
- questions about other clients
- questions outside the current member's campaign or event assignment scope

### 3. Dedicated client-safe backend, not the internal assistant queue

The client `Agent` tab must not reuse the existing admin `assistant` task queue or broad internal assistant routing.

Instead, the client feature gets:

- its own client route
- its own client API path
- its own client-safe prompt policy
- its own allowlisted context builder

This keeps the security boundary explicit and prevents prompt-only controls from becoming the only defense against data leakage.

### 4. Prepared context only

The model should receive only a prepared context payload built by the server from already approved client-safe loaders.

The model should not receive:

- direct database access
- arbitrary tool access
- service-role query power
- raw internal records
- internal event streams
- the full app state for the client account

This is the main safety boundary for version 1.

## Route And Surface Design

### Client route

Add a new client route:

- `/client/[slug]/agent`

This route lives inside the existing client shell and uses the same client access gate as the rest of the portal.

### Page layout

The page should be visually simple and conversation-first:

- page title and short helper copy
- a chat thread
- a composer input
- a small set of suggested prompt chips
- compact supporting cards or tables beneath an answer when useful

The page should feel like a focused assistant page, not a dashboard clone and not a copy of the admin `Agent Command Center`.

### Suggested prompts

Starter prompts should anchor users into the allowed product surface.

Examples:

- `Which campaigns spent the most this week?`
- `Show spend by date for Arjona.`
- `Which campaign had the best ROAS this month?`
- `What age group is responding best?`
- `Which cities are strongest right now?`
- `How are ticket sales trending for this event?`

The prompt suggestions should bias users toward safe analytics questions instead of open-ended operational questions.

## Access Control And Scope

### Base access gate

The route and API must call the existing client access layer for the active slug.

That means:

- unauthenticated users are redirected to sign-in
- pending or misrouted users are redirected by the existing entry logic
- admin preview users still work through the current admin preview behavior

### Assignment scope

If the member has limited campaign or event assignments, the assistant must only answer from those assigned objects.

This scope applies to:

- campaign listings used for context
- campaign comparison answers
- event answers
- any citations or supporting result blocks returned to the UI

The scope check must happen before building the model context, not only at render time.

### Feature gating

If events are disabled for the client portal configuration:

- event-related data is omitted from the context payload
- event-oriented suggested prompts are omitted
- event questions are refused with a clear explanation that event insights are not available in this portal

## Allowlisted Data Contract

Version 1 should answer only from a narrow allowlisted analytics contract assembled from current client-facing data loaders and their server-safe equivalents.

Allowed campaign context may include:

- campaign name
- campaign ID only for internal lookup, never for display
- status
- spend
- revenue when available
- ROAS
- impressions
- clicks
- CTR
- CPC
- CPM
- daily budget
- start time
- daily trend data
- age and gender breakdowns
- geography breakdowns
- placement breakdowns
- top creative summaries
- campaign-level recommendations already derived from approved client-safe metrics

Allowed event context may include:

- event name
- city
- venue
- date
- status
- tickets sold
- tickets available
- gross
- average ticket price
- daily or current event summary metrics already approved for the client portal

The contract must exclude:

- account IDs
- raw ad account configuration
- source system identifiers
- hidden client assignment fields
- admin notes
- internal approvals
- agent task data
- internal comments
- unshipped workflow state
- source/provider names when the answer can avoid them

## Response Rules

### Allowed answer types

The assistant should support:

- metric lookup
- basic comparisons
- summary of trends
- explanations grounded in visible metrics
- ranking questions
- timeframe questions
- event and campaign cross-references within scope

### Disallowed answer types

The assistant must refuse:

- `How are you doing this internally?`
- `What database or API is this using?`
- `Show me raw IDs or raw source rows.`
- `What structure do you use behind the scenes?`
- `Tell me about campaigns or events outside my portal.`
- requests to mutate campaigns, budgets, approvals, assets, or events

Version 1 is read-only.

### Answer format

Each answer should prefer:

1. a direct short answer first
2. a small supporting explanation
3. a compact supporting block when useful, such as cards or a small table

The assistant should:

- say when data is unavailable
- avoid invented causal claims
- avoid pretending certainty when the data only supports description
- avoid exposing internal terminology where a client-safe phrasing works

## Conversation State

Version 1 should keep conversation state light.

It may keep the recent thread context needed for follow-up questions such as:

- `How about just this month?`
- `Compare that one to Camila.`
- `What about the Miami event?`

But every answer should still be rebuilt from fresh scoped data for the current client and current request.

Do not introduce long-lived hidden memory, cross-client memory, or broad account history memory in version 1.

## Backend Architecture

### API boundary

Add a dedicated client API endpoint for the `Agent` tab.

Responsibilities:

- validate client access for the active slug
- load the current scoped analytics context
- normalize that context into a small allowlisted payload
- apply the client-safe system prompt and refusal rules
- return structured answer content to the UI

### Context builder

The backend should have a dedicated context builder module that converts existing campaign and event loaders into a model-ready client-safe payload.

Responsibilities:

- gather only the allowed campaign and event metrics
- enforce campaign and event scope before serialization
- omit internal-only fields
- generate a compact textual or structured summary that fits token constraints

The context builder should be easy to review and test because it is the main data disclosure boundary.

### Model adapter

The model integration should be isolated behind a small adapter module.

Responsibilities:

- accept the normalized client-safe context
- accept the user's question
- apply a fixed system policy for allowed and refused topics
- return a structured answer payload for the page

This keeps model-specific code from leaking into route handlers and makes policy changes easier to review.

## Error Handling

The feature must handle:

- no accessible campaigns
- events disabled
- missing metrics for a requested question
- model failure or timeout
- malformed or empty user input

Expected behavior:

- empty input is rejected client-side
- no-data cases produce a plain explanation instead of a generic error
- model failures return a short safe fallback message
- the UI never leaks stack traces, raw payloads, or internal provider errors

## Testing Expectations

The implementation plan derived from this spec should cover:

- nav visibility and active-state tests for the new `Agent` tab
- access-control tests for allowed versus disallowed client scope
- API tests proving out-of-scope campaigns or events are excluded
- refusal tests for internal-structure and source-system questions
- happy-path tests for campaign and event analytics questions
- UI tests for the chat page basic rendering and submission flow

## Non-Goals

Version 1 does not include:

- campaign or event mutations
- approval actions
- client support inbox behavior
- reuse of the internal admin assistant queue
- broad retrieval over comments, approvals, tasks, CRM, or assets
- cross-client memory
- autonomous follow-up actions
- a general Outlet knowledge assistant

## Implementation Scope Boundary

This spec covers one vertical slice:

- a new top-level client `Agent` tab
- a chat-style client page
- a dedicated client-safe API
- an allowlisted campaign and event analytics context builder
- refusal rules for internal and out-of-scope questions

It does not cover future expansions such as:

- approvals inside chat
- asset discussion inside chat
- CRM discussion inside chat
- autonomous action-taking
- broader client collaboration workflows

## Success Criteria

The feature is successful when:

- a client can ask natural-language questions about their campaigns or events
- the assistant gives useful answers grounded in visible analytics
- limited-scope client members only see answers from their assigned campaigns or events
- the assistant refuses questions about internals or data outside the allowed scope
- the product still feels like a narrow trustworthy client portal rather than a broad workspace bot
