# Docs / Superpowers Plans

Generated from the current working tree on 2026-04-28 02:30:43.

- Files: 12
- File kinds: Markdown doc (12)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 988
- Bytes: 28681
- Headings: Agent Code Quality 10/10 Implementation Plan, Chunk 1: Phase 1 -- Security Fixes, Task 1: Add owner gate to approval interactions, Task 2: Add owner gate to schedule-budget and schedule-copy-swap slash commands, Task 3: Sanitize spec.key in spawner (path traversal fix), Task 4: Move INGEST_SECRET from body to header, Chunk 2: Phase 2 -- Correctness Fixes, Task 5: Fix approval race -- build params before enqueueTask, Task 6: Gate-then-enqueue -- evaluate tier before enqueue in delegate.ts, Task 7: Fix isOwner ternary precedence bug, … (+10 more)
- Contents summary: headings: Agent Code Quality 10/10 Implementation Plan \| Chunk 1: Phase 1 -- Security Fixes \| Task 1: Add owner gate to approval interactions \| Task 2: Add owner gate to schedule-budget and schedule-copy-swap slash commands \| Task 3: Sanitize spec.key in spawner (path traversal fix) \| Task 4: Move INGEST_SECRET from b…

## `docs/superpowers/plans/2026-03-22-outlet-web-reset.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 762
- Bytes: 27467
- Headings: Outlet Web Reset Implementation Plan, Scope Guard, File Structure Map, Database / types, Shared account / access backbone, Invite / onboarding flow, Admin account settings / membership UX, Client package / reports, Dead surface cleanup / revalidation, Durable docs, … (+10 more)
- Contents summary: headings: Outlet Web Reset Implementation Plan \| Scope Guard \| File Structure Map \| Database / types \| Shared account / access backbone \| Invite / onboarding flow

## `docs/superpowers/plans/2026-03-31-client-agent-tab.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 868
- Bytes: 34373
- Headings: Client Agent Tab Implementation Plan, Scope Guard, File Structure Map, Database, env, and package contract, Client packaging, access, and admin settings, Client-agent backend, Client-agent API routes, Client UI and route wiring, Chunk 1: Packaging And Persistence Backbone, Task 1: Add `agent_enabled` and the durable client-agent ledger schema, … (+9 more)
- Contents summary: headings: Client Agent Tab Implementation Plan \| Scope Guard \| File Structure Map \| Database, env, and package contract \| Client packaging, access, and admin settings \| Client-agent backend

## `docs/superpowers/plans/2026-04-01-client-agent-chatgpt-ux.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 690
- Bytes: 22552
- Headings: Client Agent ChatGPT UX Implementation Plan, File Structure, Chunk 1: Lock The Chat Contract, Task 1: Write the failing prose-only model contract tests, Task 2: Write the failing planner tests for show intent, Chunk 2: Teach The Agent To Infer Event Meaning, Task 3: Add failing data tests for `last show` and show counts, Task 4: Route broad conversational asks away from generic overview dumps, Chunk 3: Make The UI Feel Like ChatGPT, Task 5: Write the failing UI tests for prose-only chat and working state, … (+1 more)
- Contents summary: headings: Client Agent ChatGPT UX Implementation Plan \| File Structure \| Chunk 1: Lock The Chat Contract \| Task 1: Write the failing prose-only model contract tests \| Task 2: Write the failing planner tests for show intent \| Chunk 2: Teach The Agent To Infer Event Meaning

## `docs/superpowers/plans/2026-04-01-client-agent-tool-driven-runtime.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 1436
- Bytes: 49881
- Headings: Client Agent Tool-Driven Runtime Implementation Plan, Scope Guard, File Structure Map, Database and thread-context backbone, Deterministic policy and range normalization, Normalized analytics tools, Runtime loop and compatibility wrapper, Server, route, and client transport, Cleanup and durable context, Chunk 1: Contracts And State Backbone, … (+10 more)
- Contents summary: headings: Client Agent Tool-Driven Runtime Implementation Plan \| Scope Guard \| File Structure Map \| Database and thread-context backbone \| Deterministic policy and range normalization \| Normalized analytics tools

## `docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 1047
- Bytes: 39177
- Headings: WhatsApp Ticket Concierge Runner Implementation Plan, Scope Guard, File Structure Map, Contracts, config, and local runner dependencies, Concierge ledger and webhook routing backbone, Core deterministic concierge engine, Browser adapters, map delivery, and orchestration, Standalone Codex-run worker and smoke harness, Chunk 1: Routing, Safety, And Durable State, Task 1: Add the standalone concierge contract, local runner dependencies, and ledger tables, … (+9 more)
- Contents summary: headings: WhatsApp Ticket Concierge Runner Implementation Plan \| Scope Guard \| File Structure Map \| Contracts, config, and local runner dependencies \| Concierge ledger and webhook routing backbone \| Core deterministic concierge engine

## `docs/superpowers/plans/2026-04-02-core-reset-salvage-map.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 493
- Bytes: 14169
- Headings: Core Reset Salvage Map Implementation Plan, File map, New/updated decision documents, Likely root/repo items to classify or move, Likely product surfaces to classify, Verification commands, Chunk 1: Write the salvage map before more deletion, Task 1: Inventory the current repo and active product surface, Task 2: Encode the reset rules in durable docs, Chunk 2: Remove obviously dead systems first, … (+10 more)
- Contents summary: headings: Core Reset Salvage Map Implementation Plan \| File map \| New/updated decision documents \| Likely root/repo items to classify or move \| Likely product surfaces to classify \| Verification commands

## `docs/superpowers/plans/2026-04-02-repo-organization-reset.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 474
- Bytes: 14957
- Headings: Repo Organization Reset Implementation Plan, File map, Likely files/directories to modify, Likely directories/files to move or classify, Verification commands, Chunk 1: Audit and classify the root, Task 1: Capture the current root inventory, Task 2: Inspect ambiguous directories before moving anything, Chunk 2: Root cleanup and noise quarantine, Task 3: Quarantine generated and local-only artifacts, … (+10 more)
- Contents summary: headings: Repo Organization Reset Implementation Plan \| File map \| Likely files/directories to modify \| Likely directories/files to move or classify \| Verification commands \| Chunk 1: Audit and classify the root

## `docs/superpowers/plans/2026-04-02-whatsapp-removal.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 417
- Bytes: 14668
- Headings: WhatsApp Removal Implementation Plan, File map, Active implementation likely to delete, Active implementation likely to modify, Historical database items to keep, Verification targets, Chunk 1: Inventory and define deletion boundaries, Task 1: Capture active WhatsApp touchpoints, Chunk 2: Remove web WhatsApp implementation, Task 2: Delete WhatsApp web routes and feature modules, … (+10 more)
- Contents summary: headings: WhatsApp Removal Implementation Plan \| File map \| Active implementation likely to delete \| Active implementation likely to modify \| Historical database items to keep \| Verification targets

## `docs/superpowers/plans/2026-04-03-agent-simplification.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 526
- Bytes: 15109
- Headings: Agent Simplification Implementation Plan, Chunk 1: Core Replacement, Task 1: Write the single agent prompt, Memory, Task 2: Replace router, Task 3: Simplify message handler, Task 4: Rewrite entry.ts, Task 5: Simplify slash commands, Chunk 2: Delete Dead Code, Task 6: Delete old prompts, memory, skills, … (+9 more)
- Contents summary: headings: Agent Simplification Implementation Plan \| Chunk 1: Core Replacement \| Task 1: Write the single agent prompt \| Memory \| Task 2: Replace router \| Task 3: Simplify message handler

## `docs/superpowers/plans/2026-04-03-enterprise-readiness.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 267
- Bytes: 8805
- Headings: Enterprise Readiness Implementation Plan, Chunk 1: Verification Backbone, Task 1: Remove hidden migration drift and scope root verification intentionally, Chunk 2: Agent Runtime Correctness, Task 2: Make web-triggered agent tasks executable under the live runtime, Chunk 3: Dead-Surface Cleanup, Task 3: Remove retired route/config coupling from active code paths, Chunk 4: Campaign Detail Replacement, Task 4: Replace the prototype admin campaign detail with a real operating view, Chunk 5: Durable Context, … (+1 more)
- Contents summary: headings: Enterprise Readiness Implementation Plan \| Chunk 1: Verification Backbone \| Task 1: Remove hidden migration drift and scope root verification intentionally \| Chunk 2: Agent Runtime Correctness \| Task 2: Make web-triggered agent tasks executable under the live runtime \| Chunk 3: Dead-Surface Cleanup

## `docs/superpowers/plans/2026-04-20-mobile-funnel-landing.md`
- Status: tracked-clean
- System: docs
- Group: Docs / Superpowers Plans
- Ownership: implementation plan documentation
- Type: Markdown doc
- Construction: markdown document, contains `use client`, frontmatter-like markdown structure
- Lines: 1521
- Bytes: 55607
- Headings: Mobile Funnel Landing Implementation Plan, File structure, Brand palette (tokens used across all sections), Task 1: Audit and stage deletions, Task 2: Rewrite hero.tsx, Task 3: Create proof-strip.tsx, Task 4: Create logos-strip.tsx, Task 5: Create signature-result.tsx, Task 6: Create why-outlet.tsx, Task 7: Create product-glimpse.tsx, … (+8 more)
- Contents summary: headings: Mobile Funnel Landing Implementation Plan \| File structure \| Brand palette (tokens used across all sections) \| Task 1: Audit and stage deletions \| Task 2: Rewrite hero.tsx \| Task 3: Create proof-strip.tsx
