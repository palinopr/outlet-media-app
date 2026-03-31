# Client Agent Tab Design

## Purpose

This document defines a new client-facing `Agent` tab in the client portal.

The goal is to give client members a ChatGPT-style way to ask natural-language questions about their assigned campaigns and optional events without exposing Outlet's internal structure, source systems, raw identifiers, admin-only workflow state, or implementation details.

This is a client portal feature. It is not a reuse of the internal admin assistant surface and not a general-purpose Outlet bot.

## Product Outcome

After this work:

- client portal navigation includes a top-level `Agent` tab
- client members can start new chat threads and continue existing ones
- every thread feels like a normal ChatGPT-style conversation
- the assistant can answer broadly about assigned campaigns and events using client-safe analytics
- the assistant refuses internal process, structure, setup, source-system, and out-of-scope questions

The intended user feeling is:

- "This is ChatGPT for my campaigns and events."
- "I can ask anything about my performance data naturally."
- "I can trust that it knows my account context without exposing Outlet's internals."

The feature should not feel like:

- a page helper tied to one campaign route
- a support chatbot
- a portal into raw backend objects
- a client-facing copy of the admin `Agents` page

## Core Decisions

### 1. `Agent` is a first-class client tab

`Agent` ships as a top-level client tab inside the intentionally narrow client portal.

It appears in:

- desktop client navigation
- mobile client navigation

The label is explicitly `Agent`.

### Client app matrix

For the client portal after this feature:

- `Campaigns` remains a top-level tab
- `Agent` becomes a top-level tab
- `Events` remains a top-level tab only when enabled for that client
- `Reports` remains available when enabled under the existing packaging rules

`Agent` is not a broad new workspace surface. It is a summary-first conversational surface over the same client-safe campaign and event reporting backbone.

### 2. ChatGPT-style UX, not a page-scoped helper

The user experience should match the mental model of a modern chat product:

- chat list / thread history
- `New chat`
- main conversation view
- freeform composer
- follow-up questions inside a thread

The assistant is not pre-locked to a single campaign or event page. A thread should behave like a normal conversation, not like an "ask about this record" helper.

If a user mentions a campaign or event, the assistant narrows to that record. If they do not, the assistant can reason across all campaigns and events the member is allowed to see.

### 3. Broad read-only insight scope, narrow security boundary

The assistant should not be over-simplified. It should have a broad analytics surface so it can answer useful questions naturally.

The right boundary is:

- broad read-only insight access
- narrow entity permissions
- zero internal implementation exposure

This means the assistant can answer broadly about assigned campaign and event performance, but it may not reveal:

- how Outlet does the work internally
- system architecture
- raw provider plumbing
- setup details
- account structure
- internal notes or workflow state

### 4. Dedicated client-safe backend, not the internal assistant queue

The client `Agent` feature must not reuse the internal admin assistant queue or broad internal assistant routing.

Instead it gets:

- its own client route
- its own client API path
- its own client-safe prompt policy
- its own allowlisted tool and context boundary

### 5. Prepared data and tools only

The model should receive only:

- client-safe conversation state
- client-safe tool definitions
- client-safe analytics payloads returned by those tools

The model should not receive:

- direct database access
- raw service-role query power
- arbitrary internal tool access
- internal event streams
- hidden admin workflow records
- full account state dumps

This is the primary safety boundary for version 1.

## Route And Surface Design

### Client route

Add a new client route:

- `/client/[slug]/agent`

This route lives inside the existing client shell and uses the same client access gate as the rest of the portal.

### Page layout

The page should feel like a clean assistant product:

- thread list / conversation history
- `New chat` action
- active conversation area
- empty-state helper copy
- suggested prompt chips on an empty thread
- composer anchored at the bottom
- compact supporting cards, tables, or charts under answers when useful

It should not look like a dashboard clone and should not mirror the admin `Agent Command Center`.

### Suggested prompts

Starter prompts should orient the user into the intended surface:

- `How are my campaigns doing this month?`
- `Show spend by date for Camila.`
- `Which audience is performing best right now?`
- `Compare my top campaigns this quarter.`
- `What placements are strongest?`
- `How is this event trending?`

Prompt suggestions should bias toward performance and insight questions, not operational or support requests.

## Conversation Model

### Threads

The `Agent` tab supports multiple conversation threads.

Each thread:

- has its own conversation memory
- supports follow-up questions
- can be reopened from the chat history

### New chat

`New chat` resets thread memory, but it does not change access permissions.

Every new thread starts with the same hidden client-safe core context:

- active client account
- active client member
- assigned campaign scope
- assigned event scope
- portal feature flags such as whether events are enabled

### Default scope behavior

Every thread should default to the member's full allowed scope, not to a single current page.

That means:

- if the user asks a broad question, the assistant can reason across all assigned campaigns and events
- if the user asks about one named campaign or event, the assistant narrows to that target
- if the request is ambiguous, the assistant asks a short clarifying question

This preserves the ChatGPT-style mental model while staying tenant-safe.

### Memory limits

Version 1 should keep memory thread-local and lightweight.

It may retain recent thread context needed for follow-ups such as:

- `How about just this month?`
- `Compare that one to Arjona.`
- `What about the Miami event?`

It must not introduce:

- cross-client memory
- cross-thread hidden memory
- long-lived behavioral memory beyond the current thread

Every answer should still be rebuilt from fresh scoped data on the backend.

## Access Control And Scope

### Base access gate

The route and API must call the existing client access layer for the active slug.

That means:

- unauthenticated users are redirected to sign-in
- pending or misrouted users still flow through the existing entry logic
- admin preview users continue to work through the current preview behavior

### Assignment scope

If a member has limited campaign or event assignments, the assistant must only answer from those assigned objects.

This scope applies to:

- search and resolution of campaigns or events
- comparison answers
- time-series answers
- breakdown answers
- any supporting blocks shown in the UI

The scope check must happen before any model context or tool result is built.

### Feature gating

If events are disabled for that client portal:

- event tools return unavailable
- event prompts are omitted from the empty state
- event questions are answered with a clear explanation that event insights are not available in this portal

## Client-Safe Analytics Contract

Version 1 should expose a broad read-only insights surface so the assistant can be useful without becoming artificially shallow.

The broadness should come from safe analytics breadth, not from internal system access.

### Allowed campaign reporting surface

The assistant may reason over client-safe campaign analytics such as:

- campaign name
- campaign status
- spend
- revenue when available
- ROAS
- impressions
- reach
- clicks
- click-through rate
- cost per click
- cost per thousand impressions
- conversions and conversion value when already part of approved reporting
- daily budget when already client-visible
- time-series metrics by day, week, or other supported interval
- age and gender breakdowns
- geography breakdowns
- placement and platform breakdowns
- device breakdowns when already available in client-safe reporting
- campaign, ad set, ad, and creative-level performance breakdowns
- top movers, top creatives, strongest audiences, and strongest markets derived from approved metrics

### Allowed event reporting surface

When events are enabled, the assistant may reason over client-safe event analytics such as:

- event name
- city
- venue
- event date
- event status
- tickets sold
- tickets available
- gross
- average ticket price
- sales pace
- attendance or trend summaries already approved for the client portal
- event-to-event comparisons within scope

### Excluded data

The contract must exclude:

- provider or connector tokens
- raw API payloads
- database rows outside the normalized contract
- ad account IDs
- pixel IDs
- raw campaign structure or setup fields not intended for client visibility
- internal notes
- internal comments
- internal approvals
- agent task rows
- source system names by default
- internal prompts, internal rules, or internal execution details

Direct questions about the underlying source, connector, or implementation path should be refused rather than answered partially.

## Tool Contract

The assistant should not rely on one giant precomputed blob. It should use a small set of broad, read-only, client-safe tools.

Recommended tool set:

- `search_entities(query)`
- `get_overview(range, filters?)`
- `get_timeseries(entity_ids, metrics, range, interval)`
- `get_breakdowns(entity_ids, metrics, breakdowns, range)`
- `compare_entities(entity_ids, metrics, range, compare_range?)`
- `get_top_movers(range, metric, direction, filters?)`
- `get_entity_details(entity_id, range)`
- `get_event_insights(event_ids, metrics, range)`
- `answerability_check(question)`

### Tool rules

All tools must be:

- read-only
- assignment-scoped
- client-safe by default
- normalized to stable field names
- safe to show in supporting blocks without leaking internals

Tools must not:

- execute arbitrary queries
- expose raw provider payloads
- expose internal identifiers except for non-display lookup use
- access admin-only records
- mutate campaigns, events, budgets, assets, approvals, or comments

### Entity resolution

The assistant should be able to resolve natural references like:

- `Camila`
- `Arjona March`
- `Miami event`
- `our top campaign`

If multiple in-scope entities match, the assistant should ask a short clarifying question instead of guessing.

## Response Rules

### Allowed answer types

The assistant should support:

- metric lookup
- spend-by-date questions
- comparisons across campaigns or events
- ranking questions
- trend summaries
- descriptive explanations grounded in visible metrics
- breakdown questions across age, gender, geography, placement, platform, creative, campaign, ad set, and ad when available
- follow-up questions within the same thread

### Disallowed answer types

The assistant must refuse:

- `How do you do this internally?`
- `What API or database are you using?`
- `Show raw IDs, raw setup, or account structure.`
- `What sources or connectors are behind this?`
- `Tell me about campaigns or events outside my access.`
- requests to create, edit, launch, pause, approve, or otherwise mutate campaigns or events

Version 1 is read-only.

### Answer format

Each answer should prefer:

1. a direct short answer first
2. a compact supporting explanation
3. cards, tables, or charts when they improve clarity

The assistant should:

- say when data is unavailable
- avoid invented causal claims
- avoid pretending certainty when the data only supports description
- avoid exposing internal terminology where a client-safe phrasing works

### Refusal style

Refusals should be short, calm, and product-aligned.

Example shape:

- `I can help with campaign and event performance, trends, and breakdowns, but I can’t share internal setup or system details.`

Refusals should not read like a heavy policy block unless the situation requires it.

## Backend Architecture

### API boundary

Add a dedicated client API endpoint for the `Agent` tab.

Responsibilities:

- validate client access for the active slug
- load the member's current campaign and event assignment scope
- run entity resolution and tool execution within that scope
- apply the client-safe system policy
- return a structured answer payload to the UI

### Context builder

The backend should have a dedicated client-agent server module that assembles client-safe context and tool results.

Responsibilities:

- gather only allowed campaign and event metrics
- enforce assignment scope before serialization
- omit internal-only fields
- normalize analytics into stable client-safe shapes
- keep token usage bounded without collapsing useful insight breadth

This module is the primary disclosure boundary and should be easy to review and test.

### Model adapter

The model integration should live behind a small adapter module.

Responsibilities:

- accept the user's message and thread history
- accept client-safe tool results
- apply the fixed system policy for allowed and refused topics
- return structured answer content for the page

This keeps provider-specific logic out of route handlers and makes policy changes easier to review.

## Error Handling

The feature must handle:

- no accessible campaigns
- no accessible events
- events disabled
- ambiguous entity references
- missing metrics for a requested question
- malformed or empty user input
- model failure or timeout

Expected behavior:

- empty input is rejected client-side
- no-data cases produce a plain explanation instead of a generic error
- ambiguous requests ask one short clarification question
- model failures return a short safe fallback message
- the UI never leaks raw payloads, stack traces, or internal provider errors

## Testing Expectations

The implementation plan derived from this spec should cover:

- nav visibility and active-state behavior for the new `Agent` tab
- thread list and `New chat` behavior
- access-control tests for allowed versus disallowed campaign and event scope
- API tests proving out-of-scope campaigns or events are excluded
- tool tests for entity resolution and breakdown queries within allowed scope
- refusal tests for internal-structure, setup, and source-system questions
- happy-path tests for campaign and event insight questions
- UI tests for the chat page basic rendering and message submission flow

## Non-Goals

Version 1 does not include:

- campaign or event mutations
- approval actions inside chat
- support inbox behavior
- CRM, asset, task, or comment retrieval beyond what is explicitly approved into the client-safe analytics contract
- reuse of the internal admin assistant queue
- cross-client memory
- autonomous follow-up actions
- a general Outlet knowledge assistant

## Implementation Scope Boundary

This spec covers one vertical slice:

- a new top-level client `Agent` tab
- a ChatGPT-style multi-thread chat page
- a dedicated client-safe API
- a scoped read-only analytics tool layer
- refusal behavior for internal and out-of-scope questions

It does not cover future expansions such as:

- approvals inside chat
- asset discussion inside chat
- CRM discussion inside chat
- autonomous action-taking
- broader client collaboration workflows

## Success Criteria

The feature is successful when:

- a client member can open `Agent` and use it like a normal chat product
- the assistant can answer broad campaign and event insight questions naturally
- limited-scope client members only get answers from their assigned campaigns or events
- the assistant refuses questions about internals, structure, setup, or sources
- the portal still feels narrow and trustworthy rather than like a broad workspace bot
