# Outlet Web Reset Design

## Purpose

This document defines the web product reset for Outlet Media.

The reset is not a greenfield rewrite. It is an aggressive in-place refactor that preserves business data, removes wrong surfaces, rebuilds customer identity and access around one source of truth, and re-centers the product on campaigns.

The immediate problem is not only broken pages. The product currently mixes:

- the right direction: account-aware packaging, campaign/event visibility, approvals, system events, agents
- the wrong execution style: route-local logic, duplicated surfaces, generic workspace ambitions, weak onboarding, and too many overlapping sources of truth

The reset exists to stop expanding that mixed state and replace it with one coherent web product.

## Product Outcome

After the reset, Outlet should feel like:

- a client-facing agency operating system on web
- a campaign-centered product with optional event support
- a clean, understandable customer portal
- an admin surface that owns customer/account configuration
- a system where invites, signup, access, landing, and page routing behave predictably

It should no longer feel like:

- a Notion-like workspace product
- a bag of speculative apps
- a system whose truth is split across slugs, Clerk metadata, route glue, and partially overlapping pages

## Phase 1 Scope

Phase 1 is web-first.

It does not attempt to reset the richer agent and Discord operating surface at the same time. It preserves the useful backend primitives needed later, but the main work is:

- fixing the admin/client foundation
- fixing customer identity, membership, and packaging
- fixing invite and signup flows
- fixing page routing and access behavior
- deleting the wrong shipped surfaces
- re-packaging the client web app

## Non-Goals

Phase 1 will not:

- build a phone-first product
- preserve every existing page for compatibility
- keep speculative client-facing apps alive
- reintroduce generic workspace behavior
- let CRM shape the reset
- let future asset or agent ambitions justify broad client surface area

## Core Decisions

### 1. Campaigns are the universal product center

Campaigns are the universal core across customers.

Events are optional. Not every customer needs events, so event support must be a capability that can be enabled per customer account. Events can still be first-class where relevant, but they do not define the base product model.

### 2. One shared domain model, two views

Admin and client use the same underlying campaign/account model, but not the same depth of interface.

Admin gets the deeper operating surface.
Client gets the simpler visibility surface.

The reset should not create parallel truths for admin and client. It should create one backbone with role-specific presentation and controls.

### 3. Outlet admin is the source of truth

Outlet owns the business truth for:

- customer/account records
- enabled apps per customer
- memberships and member access
- branding and portal configuration
- portal URL metadata such as slug

Clerk is authentication, not the canonical business model. Any Clerk metadata that remains should be derived or treated as cache, not as the authoritative store for customer/account configuration.

### 4. Customer identity is account-first, not slug-first

Customer/account ID is canonical.

Slug is only:

- portal URL metadata
- admin-editable configuration
- a routing convenience

Slug must stop acting like a hidden business identity. Client users should not feel slug-driven product behavior, and core business rules should not depend on slugs when a customer/account ID exists.

### 5. Preserve data, reset surfaces

The reset is destructive toward surfaces, not toward business history.

Preserve and migrate:

- customers/accounts
- memberships
- campaigns
- events
- reports
- useful assets
- useful system ledgers and workflow objects

Delete, collapse, or quarantine:

- dead client-facing product surfaces
- speculative workspace-style surfaces
- CRM as an active shipped surface
- generic routing patterns that no longer match the intended package

## Target Product Package

### Client Web

Client gets a small, understandable package:

- Home
- Campaigns
- Events, only when enabled for that customer
- Reports

Home is the first screen after login. It is a customer home overview, not a generic dashboard dump and not a redirect maze.

Client does not get standalone top-level apps for:

- CRM
- workspace
- approvals
- conversations
- assets
- notifications
- settings, unless a later real need proves it

Those concepts may still exist as embedded workflow inside the surviving apps, but they should not survive as separate client-facing product promises in Phase 1.

### Admin Web

Admin gets the broader operating surface:

- Dashboard
- Clients
- Campaigns
- Events
- Reports
- Agents
- Assets

Admin does not keep CRM or the generic workspace as active product surfaces in the reset.

## Embedded Workflow Rule

Approvals, comments, follow-through, and agent-related context should be embedded into the surviving product surfaces rather than preserved as separate apps.

The default rule is:

- if work belongs to a campaign, show it in campaign context
- if work belongs to an event, show it in event context
- if work belongs to report delivery or interpretation, show it in report context

Only promote a workflow into a standalone app later if it becomes independently necessary and cannot be understood or operated well inside the owning context.

This rule exists specifically to prevent repeating the previous overengineering pattern.

## Surface Decisions By Area

### CRM

CRM is not actively used and should not survive as a shipped product surface in Phase 1.

Action:

- remove CRM from active navigation
- stop evolving CRM pages as product surfaces
- preserve any data worth keeping, but quarantine the feature

### Workspace / Notion-like layer

The generic workspace layer should be collapsed hard.

It has the wrong product gravity. It makes the app feel broader and more abstract than the actual business use case, and it encourages hiding business state in a generic shell.

Action:

- remove workspace from shipped product surfaces
- stop routing users into it
- extract only the primitives that still matter, if any
- delete the rest from active product responsibility

### Assets

Assets survive as a full admin app in Phase 1.

However, assets must stay tightly bound to campaign operations. The reset should not let assets become another free-floating speculative system. Client does not receive a top-level Assets app in Phase 1.

### Reports

Reports survive as a real first-class client app.

Reports should provide a clean reporting surface across account, campaign, and event views where relevant. Reports should feel intentionally packaged, not like a fallback analytics page or raw dashboard reuse.

## Customer Packaging Model

Each customer/account has configurable enabled apps.

Phase 1 packaging control should use simple per-customer flags, not a highly abstract capability system.

Examples:

- campaigns: enabled by default
- events: optional
- reports: enabled

The goal is operational clarity. A simple, explicit model is preferred over a flexible but overengineered entitlement system.

## Admin Customer Settings

There should be one admin customer settings surface that controls portal setup.

That page owns:

- account identity
- branding
- portal URL / slug metadata
- enabled apps
- memberships and member access
- any client-portal-specific configuration required for login and routing

This page becomes the operational source of truth for customer packaging and access.

## Membership and Access Model

The current symptoms strongly suggest too many overlapping truths around account creation and access. The reset should collapse those into one model.

Required rules:

- admins create customer/account state in Outlet
- admins invite or assign members in Outlet
- the resulting portal access derives from Outlet account membership and packaging state
- client landing logic derives from that same state
- Clerk does not decide business access on its own

The product should no longer allow a state where a valid user can appear invited but still land in a wrong or false "no access" flow because different parts of the system disagree about their account or scope.

## Invite, Signup, and Landing Flow

This is the Phase 1 must-win flow:

1. Admin creates or updates a customer/account in Outlet
2. Admin configures the customer portal and member access in Outlet
3. Admin invites a member
4. Invite email wording clearly explains what the invite is for and what the recipient will do next
5. Recipient signs up or signs in without confusing reset/copy friction
6. Recipient lands in the correct customer portal
7. Recipient sees the correct enabled apps
8. Recipient does not hit a false access-denied or wrong-route state

This flow takes priority over secondary analytics and collaboration polish because a broken invite and landing flow makes the whole product feel unreliable.

## Route and Page Audit

The reset must include a full audit of:

- page routes
- redirects
- access guards
- invite handling
- post-auth landing rules
- empty states
- error states
- "no access" states

The point of this audit is not cosmetic cleanup. It is to guarantee that the product surface matches the account and membership model.

No route should remain shipped if:

- it no longer belongs to the intended package
- it duplicates another route's job
- it relies on stale assumptions about slugs or metadata
- it can send a valid user into a misleading or false dead end

## Architectural Boundaries

Phase 1 should enforce these boundaries:

- admin/customer/account configuration logic lives in shared feature modules, not route-local glue
- routes orchestrate, but do not own business truth
- page visibility derives from the account model
- campaign/event/report views own their embedded workflow context
- auth state and business state are separated cleanly

The goal is not only cleaner code. The goal is to make failures understandable and to reduce the number of places where identity, packaging, and access logic can drift.

## Migration Strategy

The migration strategy is:

- preserve business data
- migrate customer/account and membership truth onto the new model
- remap routing and landing behavior to that model
- remove or quarantine surfaces that no longer belong

This is a preserve-and-migrate reset, not a rebuild-and-reimport fantasy. Existing campaigns, reports, customers, and useful assets should continue to matter.

## Success Criteria

Phase 1 is successful when all of the following are true:

- admin customer settings is the clear source of truth for portal configuration and access
- customer/account identity no longer depends on slug-driven business logic
- invite email copy is understandable
- signup and first-login flow lands people in the right portal
- valid users do not hit false access or wrong-route states
- client package is clean and limited to Home, Campaigns, optional Events, and Reports
- CRM and workspace no longer shape the shipped product
- campaign-centered operating context feels coherent across admin and client
- reports remain first-class for clients
- assets remain first-class for admin without becoming speculative sprawl again

## Implementation Shape

The reset should be executed in this order:

1. Remove or quarantine wrong surfaces that should no longer exist
2. Rebuild the account/customer, membership, and packaging model
3. Rebuild invite, signup, landing, and access behavior
4. Repackage the client app around Home, Campaigns, optional Events, and Reports
5. Reconnect or preserve the admin surfaces that survive on the same backbone
6. Stabilize and test before reconnecting richer agent-facing behaviors

## Why This Is Not A Rewrite

The repo already contains useful foundations. Throwing them away would lose real progress and repeat discovery work.

The right move is to preserve truth, delete wrong promises, and force the remaining product onto one coherent model.
