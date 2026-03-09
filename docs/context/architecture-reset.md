# Architecture Reset

This note is the durable reset plan for Outlet when the current implementation starts drifting away from the intended product shape.

It is not a greenfield fantasy. It is a practical rule set for deciding:
- what to preserve
- what to stop expanding
- what to collapse
- what to rebuild first

Use this note when the project starts to feel like:
- too many surfaces for the same job
- too much business logic hidden in prompts
- too many route-local reads and writes
- too many "almost the same" workflow modules
- too much truth spread across Discord, web, memory files, and ad hoc tables

## Current Diagnosis

The repo already contains many of the right ideas:
- first-class workflow objects
- `system_events`
- `approval_requests`
- `agent_tasks`
- client membership and scope work
- shared feature modules
- Discord as a control plane and web as a shared visibility surface

The problem is not that the whole project is wrong.

The problem is that the implementation is currently mixing two architectures:
- the intended entity-first, event-driven operating system
- an older prompt-first, route-first, surface-by-surface build style

That mixed state creates confusion and makes the system feel less reliable than it should.

## Main Structural Failures

### 1. Product packaging is broader than the intended client surface

The intended client package is narrow: campaigns and events first.

But the shipped client route tree currently exposes many more top-level surfaces:
- approvals
- assets
- conversations
- CRM
- notifications
- reports
- settings
- updates
- workspace

Evidence:
- `src/app/client/[slug]/**`
- `src/app/client/[slug]/components/nav-config.ts`

This creates two problems:
- customers have too many entry points before the campaign/event core is fully stable
- the team has to keep many client-facing surfaces coherent at once

### 2. Prompt memory still carries too much operational truth

The agent runtime is still too dependent on prompts and markdown memory for business context and routing behavior.

Examples:
- Discord routing is heavily channel-based in `agent/src/discord/core/router.ts`
- intake and control logic are concentrated in `agent/src/discord/core/entry.ts`
- delegation and side-effect execution are concentrated in `agent/src/agents/delegate.ts`
- specialist prompts still contain operational truth that can go stale

This is exactly the wrong place for truth such as:
- which campaign or client a conversation belongs to
- whether a live campaign exists
- who can approve a conversation
- which exact object should be acted on

Prompts should shape behavior, not own core state.

### 3. Core backend modules are too monolithic

A few large files are carrying too much of the platform:
- `src/features/whatsapp/server.ts`
- `src/features/notifications/server.ts`
- `src/features/system-events/server.ts`
- `agent/src/services/email-intelligence-service.ts`
- `agent/src/discord/core/entry.ts`
- `agent/src/agents/delegate.ts`

Large files are not automatically wrong, but these files each combine multiple responsibilities:
- parsing
- authorization
- orchestration
- persistence
- routing
- formatting
- external side effects

That makes it hard to reason about failures and hard to test narrow behavior.

### 4. Service-role reads and writes are still spread too widely

The codebase is moving toward scoped Clerk-backed reads, but a large amount of logic still reaches straight for `supabaseAdmin`.

Evidence:
- `src/lib/supabase.ts`
- widespread `supabaseAdmin` usage across `src/features/**`, `src/app/**`, and API routes

This is not just a security concern. It is an architecture concern:
- access rules become hard to reason about
- feature modules become tied to broad database power
- route-local code starts duplicating ownership and scope checks

### 5. Workflow patterns are repeated per entity instead of being fully generalized

The codebase has parallel implementations for:
- campaign comments
- asset comments
- event comments
- CRM comments
- follow-up items per entity
- work queue aggregation
- conversation aggregation

Examples:
- `src/app/api/campaign-comments/route.ts`
- `src/app/api/asset-comments/route.ts`
- `src/features/conversations/server.ts`
- `src/features/work-queue/server.ts`

This is better than burying everything in generic docs, but it is still costly:
- every entity gets its own nearly-parallel mutation path
- notification and revalidation logic must be repeated
- access and scope filtering drift over time

The right model is:
- first-class entity-owned workflow objects
- shared workflow primitives under them
- fewer route-local rewrites

### 6. The app and agent still share state imperfectly

The schema is converging on shared ledgers, but the runtime shape is still split:
- app-side WhatsApp logic in `src/features/whatsapp/server.ts`
- agent-side WhatsApp handling in `agent/src/services/whatsapp-cloud-service.ts`
- app-side task visibility in `src/lib/agent-jobs.ts` and `src/features/agent-outcomes/server.ts`
- agent-side queue ownership in `agent/src/services/queue-service.ts`

This is acceptable only if the contracts are explicit and narrow.

Right now the contracts are improving, but too much orchestration logic still exists in two places.

## What To Preserve

Do not throw away these directions:

- `system_events` as the shared product timeline
- `approval_requests` as the first-class decision object
- `agent_tasks` as the bounded execution ledger
- shared feature modules under `src/features/`
- client membership and scope-aware visibility work
- Discord as the internal control plane
- web as the admin/client visibility layer
- campaign and event pages as the center of customer value

These are the right foundations. The reset is about enforcing them consistently.

## What To Stop Expanding

Until the reset lands, avoid adding more breadth in these areas:

- new client top-level apps
- new Discord specialist lanes that rely mainly on prompt behavior
- more entity-specific workflow copies
- more route-local Supabase mutations
- more live side effects executed from chat interpretation alone

If a new need appears, prefer:
- extending a shared primitive
- adding one bounded executor
- adding one event consumer
- embedding context inside campaigns/events instead of creating another app

## Reset Principles

### 1. One backbone, many surfaces

Web and Discord must remain two views on one system.

That means:
- the database owns truth
- feature modules own business rules
- Discord is an operator shell over those rules
- web is a visibility and collaboration shell over those rules

### 2. Context binding must be explicit

Every important conversation should be attached to a real object:
- client
- campaign
- event
- CRM contact
- WhatsApp conversation
- asset

Do not let prompts infer that binding from raw chat when the system can persist it.

### 3. Agents consume typed tasks, not ambiguous chat

Chat is only an intake surface.

The real work unit should be:
- an event
- a task
- an approval request
- a typed command payload

### 4. Shared workflow primitives should be reused

For comments, follow-ups, approvals, notifications, and activity:
- keep entity ownership explicit
- share the mutation, audience, revalidation, and event-emission patterns
- stop cloning route handlers with only light field changes

### 5. Client packaging must shrink before it grows

The client portal should temporarily get simpler, not broader.

The target package is:
- Overview
- Campaigns
- Events

Everything else should either:
- be embedded inside those pages
- remain admin-only
- be hard-gated until its shared primitive is genuinely stable

## Recommended Rebuild Order

### Phase 0. Freeze breadth

Do not add:
- new client apps
- new Discord channels
- new top-level workflow centers
- new autonomous pods

Only stabilization and backbone work should happen until the first clean slice is solid.

### Phase 1. Harden the shared backbone

First-class targets:
- `system_events`
- `approval_requests`
- `agent_tasks`
- shared workflow routing metadata
- conversation-to-entity binding

Required outcomes:
- clear event envelope
- explicit idempotency and correlation
- one place to derive agent outcome state
- one place to resolve client/campaign/event ownership

### Phase 2. Collapse the client surface

Keep or strengthen:
- overview
- campaigns
- events

Collapse or gate:
- updates
- conversations
- approvals
- reports as a standalone top-level client destination if it duplicates overview/campaign/event value
- CRM
- assets
- workspace
- notifications as a standalone destination unless it is truly required
- settings/connect sprawl beyond minimal safety and account health

The information should not disappear. It should move into campaign and event detail surfaces.

### Phase 3. Clean the Discord control plane

Discord should not be the place where truth lives.

Refactor toward:
- deterministic intake handlers
- typed command payloads
- explicit object binding
- bounded executors for live side effects
- fewer specialist prompts holding state

Priority examples:
- campaign-bound thread routing
- owner WhatsApp control rules as code, not convention
- scheduler tasks as typed objects, not prompt promises
- executor-only live Meta mutations

### Phase 4. Break up the monoliths

Split large platform files by responsibility.

Examples:
- `src/features/whatsapp/server.ts`
  - webhook normalization
  - contact/conversation upsert
  - task planning
  - outbound send resolution
  - auto-ack policy
  - owner control parsing
- `src/features/notifications/server.ts`
  - creation
  - routing enrichment
  - scope filtering
  - approval fallback reads
- `agent/src/discord/core/entry.ts`
  - access control
  - deterministic intake
  - manual commands
  - routing orchestration

### Phase 5. Generalize workflow primitives

Keep entity ownership, but reduce repeated plumbing.

The target is not one generic comment table for everything.
The target is:
- entity-specific tables when they matter
- shared workflow helper layers for create/read/notify/revalidate/event logic

## First Vertical Slice To Rebuild Cleanly

If starting from the most important slice, rebuild this first:

### Campaign and Event operating loop

The slice:
- client sees campaign/event status
- client comments on campaign/event
- comment creates a visible discussion item
- a bounded agent task can be requested from that discussion
- approval is explicit when needed
- outcome appears back on the same campaign/event timeline

Why this first:
- it is the core customer promise
- it forces the app and agent to share one backbone
- it reduces the need for separate updates/conversations/workspace client apps

Required surfaces:
- web: campaign detail and event detail
- Discord: bounded operator lanes and owner approval channels
- backend: system event, approval, task, and notification primitives

## How To Evaluate New Work During The Reset

Before shipping any new work, ask:

1. Is this attached to a first-class entity?
2. Does it emit a structured event?
3. Does it create or consume a bounded task instead of relying on prompt memory?
4. Is the client experience narrower and clearer, or broader and noisier?
5. Does the work reduce duplication, or create another parallel path?

If the answer is unclear, do not expand the surface yet.

## Bottom Line

The right move is not:
- move everything to web
- delete Discord
- rewrite the whole product from scratch

The right move is:
- keep the shared backbone
- narrow the client package
- make Discord thinner and more deterministic
- stop storing truth in prompts
- refactor around explicit entities, events, tasks, and approvals

When in doubt, preserve the backbone and reduce the number of surfaces.
