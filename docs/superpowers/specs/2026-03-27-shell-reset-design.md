# Outlet Shell Reset Design

## Purpose

This document defines the shell reset for Outlet Media.

The goal is not to build a new app in a new repo. The goal is to aggressively refactor the existing app into a smaller, cleaner product shape that is stable enough to build autonomous agency features on top.

The current problem is not only bugs. The app currently carries too many surfaces and too many old workflow ideas the product no longer wants:

- CRM
- assets as a top-level creative operating surface
- reports as a top-level client promise
- workspace-style product gravity
- operational readout clutter
- generic workflow summaries that make the app feel like a broad workspace instead of a focused agency system

The reset exists to:

- keep the app in the same repo
- preserve useful auth, database, and integration foundations
- remove product areas Jaime does not want
- clean the web shell first
- only then begin building the next autonomous slice

## Product Outcome

After the reset, the product should feel like:

- a focused agency operating system
- an admin surface for campaign and client operations
- a client portal centered on campaign visibility and published updates
- a system that can later support Codex-driven internal operator workflows without turning back into a generic workspace app

It should no longer feel like:

- a half-CRM
- a creative asset review product
- a reporting dashboard bundle
- a workspace clone
- a product with many overlapping workflow widgets and summary blocks

## Approved Product Shell

### Admin

Admin keeps only these top-level surfaces:

- Dashboard
- Campaigns
- Events
- Clients
- Users
- Settings
- Activity
- Agents

`Agents` survives as an admin-only surface, but only as a thin main-agent chat entry point. It should not be a broad specialized-agent control center in this reset.

### Client Target

The approved target client shell is:

- Campaigns
- Events, when enabled for that client
- Updates

`Activity` is not a client page. It is admin-only and is used to see what people are doing on the web.

### Client Phase 1 Shipped Shell

The shell-only refactor does not implement the new `Updates` product area yet.

So the phase-1 shipped client shell is:

- Campaigns
- Events, when enabled for that client

During phase 1:

- `Updates` is a reserved phase-2 surface
- no `Updates` nav item ships yet
- any old client route that does not survive the reset redirects to the surviving client shell

## Removed Product Areas

The following product areas are removal targets in this reset:

- CRM
- Assets
- Reports
- workspace-style surfaces
- operational readout UI
- creative snapshot UI
- generic approval/discussion/agent-outcome summary sections that do not belong to the kept shell

This applies both to navigation and to route-level shipped product surfaces.

## Core Decisions

### 1. Refactor, do not rebuild from zero

The reset happens in the same repo.

Preserve:

- current project and deployment setup
- useful auth and membership foundations
- useful domain data and integrations
- any backend primitives that still fit the kept shell

Do not:

- create a second app inside the repo
- build a parallel replacement product before deleting the old one
- replatform the whole database without proof it is needed

### 2. Shell first, features later

The first implementation pass is shell-only.

That means:

- nav cleanup
- route cleanup
- dashboard cleanup
- feature pruning where obviously dead
- test hardening on the kept surfaces

It does not include:

- the new client updates workflow
- Codex integration work beyond preserving the `Agents` surface
- new autonomous behaviors
- new approval flows

The shell must become clean before new product work begins.

### 3. Admin activity is operator-facing, not client-facing

`Activity` is an admin product area used to understand what operators and users are doing on the web.

It is not a client communication surface.

### 4. Client updates are a separate product area

The client-facing communication surface is `Updates`.

Approved shape:

- client sees `Updates`
- admin creates and manages updates
- agents can help draft updates later
- agent-written updates always require admin approval before clients see them

This updates system is not part of the shell-only refactor. It requires a separate follow-on spec and implementation plan after cleanup is complete.

### 5. Agents remain internal

The main agent should remain an internal/admin tool.

Approved day-1 shape for `Agents`:

- main agent chat only

Not included in day 1:

- specialized agent controls
- rich job-management UI
- client-facing chat

During the shell-only reset, `Agents` remains a kept admin route and nav item, but no new Codex integration or redesign work is included. The reset only preserves the surface and prevents it from expanding further.

## Non-Goals

This reset will not:

- preserve every current feature module
- maintain compatibility with removed product promises forever
- keep dead routes alive indefinitely after stabilization
- build the full autonomous agency in the same pass
- solve agent runtime architecture and shell cleanup at the same time
- implement the new client `Updates` system in the same spec

## Reset Principles

### 1. Smaller product promise

The new shell should make fewer promises and make them well.

### 2. Remove wrong product gravity

If a page makes the app feel like a workspace, CRM, creative review suite, or broad reporting portal, it should be removed unless it clearly belongs to the kept shell.

### 3. Codex comes after cleanup

The product should be cleaned first. Codex-backed internal agent work can then be added on a cleaner foundation rather than being forced into a cluttered shell.

### 4. Keep only foundations that still serve the target shell

Backend primitives can survive only if they clearly still support:

- Dashboard
- Campaigns
- Events
- Clients
- Users
- Settings
- Activity
- Agents
- future client `Updates`

Anything that exists mainly to support removed surfaces should be deleted or quarantined.

## Refactor Scope

### Phase 1: Product shell cleanup

Required work:

- replace admin nav with only the approved admin shell
- replace client nav with only the phase-1 shipped client shell
- remove links to removed surfaces
- hard-redirect removed routes temporarily while cleanup is in progress

This phase is the only implementation scope covered by the implementation plan derived from this spec.

### Phase 2: Dashboard cleanup

Required removals:

- creative snapshot
- operational readout
- approval/discussion/agent-outcome summary blocks that only serve the old workflow shell
- asset review and generic workflow summary clutter

The dashboard should focus on the kept product areas only.

### Phase 3: Feature pruning

Order:

1. delete dead route files
2. delete dead UI components
3. delete dead loaders, actions, and server helpers
4. keep or extract shared primitives only when they still clearly serve the approved shell

Likely heavy-cut or removal areas:

- CRM
- assets UI
- reports UI
- workspace UI and related APIs
- operations-center style summary logic
- client-updates leftovers that do not match the new model
- generic workflow widgets built around removed product areas

### Phase 4: Test hardening

Before new feature work begins:

- route-level coverage for all kept top-level pages
- import smoke coverage for kept core server modules
- focused tests for shared loaders/actions that survive pruning
- removal or rewrite of tests tied only to deleted product areas
- green `type-check` and focused test pass

## Redirect Matrix

The reset should use explicit temporary redirects during stabilization instead of leaving dead pages accessible.

### Admin

| Route | Phase 1 behavior | Final disposition |
|------|-------------------|-------------------|
| `/admin/dashboard` | keep | keep |
| `/admin/campaigns` | keep | keep |
| `/admin/events` | keep | keep |
| `/admin/clients` | keep | keep |
| `/admin/users` | keep | keep |
| `/admin/settings` | keep | keep |
| `/admin/activity` | keep | keep |
| `/admin/agents` | keep as-is, no expansion in phase 1 | keep |
| `/admin/assets` | redirect to `/admin/campaigns` | delete route after stabilization |
| `/admin/assets/[assetId]` | redirect to `/admin/campaigns` | delete route after stabilization |
| `/admin/reports` | redirect to `/admin/dashboard` | delete route after stabilization |
| `/admin/crm` | redirect to `/admin/clients` | delete route after stabilization |
| `/admin/crm/[contactId]` | redirect to `/admin/clients` | delete route after stabilization |
| `/admin/workspace` | redirect to `/admin/dashboard` | delete route after stabilization |
| `/admin/workspace/[pageId]` | redirect to `/admin/dashboard` | delete route after stabilization |
| `/admin/workspace/tasks` | redirect to `/admin/dashboard` | delete route after stabilization |
| `/admin/approvals` | redirect to `/admin/dashboard` | delete route after stabilization |
| `/admin/conversations` | redirect to `/admin/dashboard` | delete route after stabilization |
| `/admin/notifications` | redirect to `/admin/dashboard` | delete route after stabilization |

### Client

| Route | Phase 1 behavior | Final disposition |
|------|-------------------|-------------------|
| `/client/[slug]/campaigns` | keep | keep |
| `/client/[slug]/events` | keep when enabled | keep when enabled |
| `/client/[slug]/event/[eventId]` | keep when enabled | keep when enabled |
| `/client/[slug]/campaign/[campaignId]` | keep | keep |
| `/client/[slug]` | redirect to `/client/[slug]/campaigns` | keep as redirect or resolver |
| `/client/[slug]/reports` | redirect to `/client/[slug]/campaigns` | delete route after stabilization |
| `/client/[slug]/notifications` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/approvals` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/conversations` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/workspace` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/workspace/[pageId]` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/workspace/tasks` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/assets` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/assets/[assetId]` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/crm` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/crm/[contactId]` | redirect to `/client/[slug]/campaigns` | delete route/helper target after stabilization unless the feature is later reintroduced under a separate spec |
| `/client/[slug]/updates` | phase 1 does not ship Updates; legacy/helper-generated links resolve to `/client/[slug]/campaigns` until phase 2 | add in phase 2 under a separate spec |

If route inventory changes are discovered during implementation, the implementation plan should extend this matrix before deleting more surfaces.

## Kept Surfaces By Responsibility

### Dashboard

Purpose:

- admin overview of current operating state
- only using kept product areas

Should not contain:

- creative/asset snapshot blocks
- operational readout blocks
- report-centric product framing
- generic workflow clutter

### Campaigns

Purpose:

- core operating surface for ad work

### Events

Purpose:

- ticketing/event operating surface when relevant

### Clients

Purpose:

- account and customer management hub

### Users

Purpose:

- team and portal-access management

### Settings

Purpose:

- admin/system configuration

### Activity

Purpose:

- operator-facing history of what users are doing on the web

### Agents

Purpose:

- thin Codex-backed main-agent chat entry point for admins

### Client Updates

Purpose:

- client-facing published communication surface
- managed from admin
- later drafted by agents with mandatory approval

This surface is phase 2 only and is intentionally out of scope for the shell reset implementation plan.

## Execution Sequence

The approved execution order is:

1. shell cleanup only
2. dashboard cleanup
3. feature pruning
4. test hardening
5. new build work on top of the cleaned shell

## Phase Boundary

This spec is intentionally planning only the shell reset.

The first implementation plan derived from it may cover:

- admin shell cleanup
- client phase-1 shell cleanup
- route redirects and deletions
- dashboard cleanup
- feature pruning
- test hardening

It may not cover:

- building `Updates`
- Codex chat implementation changes
- new autonomous workflows
- new publishing or approval mechanics

Those follow in separate specs after the shell reset is stable.

## Risks

### 1. Accidental deletion of useful shared backend code

Mitigation:

- prune route and UI surfaces first
- only delete backend primitives after verifying they do not serve kept areas

### 2. Cleaning and building at the same time

Mitigation:

- phase 1 is shell-only by design
- no new `Updates` implementation during the refactor pass

### 3. Leaving compatibility clutter around forever

Mitigation:

- use temporary redirects only during the reset
- remove dead compatibility paths after stabilization

## Immediate Next Step

The first implementation pass should be the shell reset only:

- keep the approved admin shell
- keep the approved client shell
- remove wrong routes and nav items
- remove dashboard clutter
- stabilize tests

Only after that should the team implement the new admin-managed, client-facing `Updates` system and Codex-backed internal agent workflows.
