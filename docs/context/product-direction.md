# Product Direction

## What Outlet Is

Outlet is a client-facing autonomous agency operating system.

It is not just:
- a Notion clone
- a reporting dashboard
- a CRM
- an ads manager

It is the shared environment where:
- Outlet team members do the work
- clients can see what is happening and stay involved
- contractors and specialists collaborate in context
- agents help move work forward

The interface can borrow strong Notion-like patterns, but the product model should be centered on agency operations.

## Core Problem

Media buying and campaign operations are fragmented.

Typical failure modes:
- clients feel blind and disconnected
- specialists work in silos
- context gets lost between chat, docs, assets, approvals, and campaign tools
- results are visible too late or without explanation
- too much depends on humans relaying information manually

Outlet should reduce those failures by making work visible, collaborative, and agent-aware.

## Two Modes Of Visibility

Outlet should support both:
- a traditional dashboard experience with charts, KPIs, trends, status cards, and familiar summaries
- a deeper operating-system experience with activity, approvals, comments, tasks, assets, and agent-driven workflows

Some users want to live in workflows. Others want to see graphs, results, and a clear summary. The product should serve both without forcing every user into the same depth of interaction.

## Product Outcome

Customers should feel:
- they can see everything that matters
- they are part of the process without needing to manage every detail
- Outlet is guiding the work, not just reporting on it
- they can choose between a simple dashboard view and a deeper collaborative operating view

Internal team should feel:
- work is organized around the real client/campaign context
- important actions trigger the next step automatically
- they do not need to re-explain the same context across tools

## Product Model

The workspace/editor layer is the shell. The actual product is a set of connected apps inside that shell.

Core first-class areas:
- CRM
- Clients
- Campaigns
- Events / ticketing workflows
- Assets / creative pipeline
- Tasks / approvals
- Reports / results
- Conversations / comments
- Activity / audit trail
- Agents / automations

## Design Principle

Everything should stay attached to the right context.

Examples:
- a creative upload belongs to a campaign, client, and asset thread
- a campaign change belongs to a campaign timeline and activity feed
- a client comment belongs to the exact work item or page it references
- an agent action belongs to the event that triggered it and the outcome it produced

Avoid generic "notes everywhere" designs that hide business state inside unstructured pages.

## Long-Term Direction

Outlet may expand beyond ads and ticket sales into a broader AI-enabled client environment.

That means:
- assume more apps will be added over time
- build multi-tenant foundations early
- prefer reusable operating-system patterns over one-off dashboards

## Product Priorities

1. Shared visibility
2. Clear guided execution
3. Context-rich collaboration
4. Event-driven automation
5. Safe agent actions
6. Client-ready app surfaces

## What To Preserve

- Notion-like speed and flexibility in the UI
- client-friendly visibility
- familiar dashboard readability for traditional users
- strong campaign and results orientation
- agent orchestration as a real differentiator
