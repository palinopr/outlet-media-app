# Discord Growth Team Plan

## Goal

Build an internal, Discord-first autonomous growth team for Outlet that can research trends, create content, launch approved paid-media work, capture inbound interest, and route qualified leads without introducing a parallel web app by default.

The app and database should act as the durable ledger and execution backbone behind Discord.

## Non-Goals

- Do not build a client-facing web surface for this team by default.
- Do not build fake-account, proxy, fingerprint-spoofing, or spam workflows.
- Do not let content or strategy agents publish or spend directly.
- Do not rely on prompt text and markdown memory alone for learning.

## Operating Model

- Discord channels and threads are the control plane.
- `agent_tasks` is the cross-agent execution queue.
- `system_events` is the durable timeline.
- Pod-specific ledgers hold drafts, examples, corrections, outcomes, and playbooks.
- Approval-gated executor agents are the only agents allowed to perform live external actions.

## Pod Structure

### 1. Boss / Revenue Supervision

- `boss`
- Responsibilities:
  - assign priorities across pods
  - resolve blockers
  - decide what requires owner approval
  - promote repeated wins into durable playbooks

### 2. Growth Pod

- `growth-supervisor`
- `tiktok-supervisor`
- `youtube-supervisor`
- `instagram-supervisor`
- `content-finder`
- `trend-scout`
- `hook-strategist`
- `community-manager-{platform}`
- `platform-analyst-{platform}`

Responsibilities:
- identify demand signals and trends
- turn ideas into platform-specific series and episodes
- monitor comments and platform-native inbound intent

### 3. Creative Pod

- `creative-supervisor`
- `scriptwriter`
- `video-creator`
- `image-creator`
- `editor-packager`
- `creative-qa`

Responsibilities:
- generate and package source assets
- enforce asset-quality and policy checks
- hand approved asset packages to publishers or paid-media executors

### 4. Paid Media Pod

- `paid-media-supervisor`
- `media-strategist`
- `campaign-planner`
- `adset-builder`
- `creative-matcher`
- `platform-executor-meta`
- `platform-executor-tiktok`
- `performance-monitor`
- `budget-manager`

Responsibilities:
- plan paid campaigns and ad sets
- prepare approved launch packets
- execute only through bounded platform executors
- monitor results and open follow-up work

### 5. Lead Ops Pod

- `lead-ops-supervisor`
- `inbound-triage`
- `lead-qualifier`
- `crm-handoff`
- `appointment-setter`

Responsibilities:
- convert comments, DMs, forms, and other inbound interest into routed leads
- qualify and hand off accepted leads into CRM and follow-up flows

### 6. Analytics Pod

- `analytics-supervisor`
- `reporting-analyst`
- `experiment-analyst`
- `attribution-analyst`

Responsibilities:
- summarize performance
- score experiments
- connect platform activity to actual lead and revenue outcomes

### 7. Ops / Automation Pod

- `ops-supervisor`
- `task-dispatcher`
- `publisher-{platform}`
- `browser-executor`
- `compliance-risk-guard`

Responsibilities:
- route work reliably
- enforce locks and approval gates
- run publishing or browser-backed execution only from approved structured tasks

## Shared Agent Contract

Every new autonomous flow should follow this path:

1. Trigger arrives as an event, scheduled task, or explicit Discord ask.
2. The supervisor or worker loads only scoped context for that domain.
3. The agent returns a structured decision or draft.
4. If the action is risky, an approval request is created.
5. An executor performs the live side effect, if approved.
6. The result is written back into a durable ledger.
7. A `system_events` entry records the outcome.
8. The system stores examples, corrections, and measured outcomes for future learning.

## Learning Architecture

Markdown memory files remain useful for:
- current reminders
- operator notes
- short-lived context

But durable learning should come from structured ledgers.

Recommended shared pattern:
- `*_events`: raw intake and triage state
- `*_drafts`: suggested outputs
- `*_examples`: real sent/published outputs
- `*_corrections`: owner/operator feedback
- `*_outcomes`: measured results
- `*_playbooks`: promoted patterns approved by supervisors

Supervisors should promote durable playbooks.
Evaluators should score whether those playbooks still perform well.

## Proposed Growth Ledgers

- `growth_accounts`
  - real owned social accounts by platform
- `growth_lanes`
  - target segments and offers
- `growth_series`
  - repeatable content programs
- `growth_ideas`
  - trends, hooks, and raw concepts
- `growth_content_jobs`
  - canonical production records for each content episode
- `growth_assets`
  - scripts, clips, stills, thumbnails, and packaged outputs
- `growth_post_targets`
  - per-platform publish variants for one content job
- `publish_attempts`
  - every attempted publish and outcome
- `growth_inbound_events`
  - comments, DMs, forms, and other lead signals
- `growth_leads`
  - qualified opportunities and handoff status
- `growth_metrics_snapshots`
  - engagement, lead, and revenue-linked metrics
- `growth_playbooks`
  - promoted patterns for hooks, packaging, qualification, or launch rules

## Discord Layout

Recommended first-pass channels:

- `#boss`
- `#growth`
- `#content-lab`
- `#tiktok-ops`
- `#youtube-ops`
- `#paid-media`
- `#lead-inbox`
- `#approvals`
- `#growth-dashboard`

Use threads for:
- one content job
- one lead
- one launch packet
- one account incident
- one experiment

## Side-Effect Boundaries

- Workers may draft, classify, summarize, or prepare.
- Supervisors may route and request approvals.
- Executors may publish, send, launch, or mutate live systems.
- Evaluators may score and recommend, but do not mutate live systems directly.

Only the following role classes may cause live side effects:
- `publisher-*`
- `platform-executor-*`
- `browser-executor`
- explicitly approved owner-plane agents such as email or meetings

## Autonomy Levels

- `shadow`
  - observe and recommend only
- `draft_only`
  - produce drafts and structured proposals
- `assisted`
  - execute only after explicit approval
- `live`
  - only for low-risk internal actions after stable logs and evals

Recommended default:
- growth, creative, and lead ops start in `draft_only`
- publishers and paid-media executors start in `assisted`
- evaluator agents can run automatically once their reads are stable

## Rollout Order

### Phase 1: Shared Architecture

- codify supervisor / worker / executor / evaluator roles in repo docs
- define shared learning and playbook pattern
- add growth-team ledgers and task contracts

### Phase 2: First Internal Growth Pod

- launch `growth-supervisor`, `content-finder`, `trend-scout`, `hook-strategist`
- launch `creative-supervisor`, `scriptwriter`, `video-creator`
- launch one platform squad in draft-only mode, starting with TikTok

### Phase 3: Publishing and Lead Capture

- add `publisher-tiktok`
- add `community-manager-tiktok`
- add `lead-qualifier` and `crm-handoff`
- capture inbound events and route qualified leads

### Phase 4: Paid Media Execution

- add `media-strategist`, `campaign-planner`, `adset-builder`, `platform-executor-meta`
- add executor-only launch flow with approvals
- add `performance-monitor` and `budget-manager` in assisted mode

### Phase 5: Evaluation and Scale

- add evaluator agents
- promote repeated wins into shared playbooks
- clone the proven pattern to YouTube and Instagram

## Immediate Build Slice

If implementation starts now, the first slice should be:

- growth pod routing in Discord
- durable ledgers for ideas, content jobs, examples, corrections, and outcomes
- one TikTok supervisor flow in `draft_only`
- one publisher in `assisted`
- one lead qualification handoff into CRM

That is enough to prove the backbone before adding more platforms or more workers.
