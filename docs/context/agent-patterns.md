# Agent Patterns

## Agent Role In Outlet

Agents are operational workers inside the system.

They should help move work forward by reacting to structured context, not by replacing the product with chat.

## Control Plane Separation

Do not collapse owner control, employee collaboration, and automation execution into one shared surface.

Web and Discord are both valid Outlet surfaces.
Choose the surface intentionally:
- web for shared admin/client product views
- Discord for internal control-plane and autonomous team work
- both when the same workflow needs visible product state plus autonomous execution

Do not let web and Discord drift into separate systems. They should share the same domain objects, approvals, task ledgers, and `system_events` backbone.

Preferred split:
- Discord is the owner and team workspace plane, with owner-only channels for private supervision, inbox triage, sensitive approvals, and executive alerts.
- Owner work should stay in private Discord surfaces such as `#boss`, `#whatsapp-boss`, `#email`, `#meetings`, `#email-log`, `#approvals`, and `#schedule`.
- Team collaboration should stay in scoped Discord channels such as `#general`, `#media-buyer`, `#tm-data`, `#creative`, and client channels.
- `#dashboard` is a team work surface, not a bot-only read-only sink. Team members should be able to ask for reporting help there, and those requests can hand off to Boss or other owner workflows when needed.
- Boss should be the primary assistant surface. Direct messages to the bot and explicit assistant-style asks in mapped work channels should route to Boss and reply in place instead of forcing the operator to remember which specialist lane to use first.
- Meeting and scheduling requests from team channels should use deterministic runtime handoff to Boss. Do not rely only on a specialist prompt to remember to emit delegation JSON for owner-scheduling workflows.
- Timed operational asks from team channels should also use deterministic runtime handoff plus durable scheduler state. If someone asks for a campaign or budget action "at 12am," Boss should write a real scheduled task and the scheduler should dispatch the specialist handoff when due instead of relying on prompt memory.
- Timed Meta mutations that need exact live IDs, such as ad copy swaps, should use a structured command or task payload with the concrete IDs to activate/pause plus a bounded executor path. Do not let Boss or Media Buyer improvise those IDs from chat at execution time.
- Unknown Discord channels should fail loud instead of silently falling back to a generic chat agent. If a channel is intended to be a work surface, add an explicit route; otherwise tell the operator there is no route configured.
- Boss supervision and recent agent context should come from durable `system_events`, not local session files. Direct Discord turns and agent-task lifecycle changes should be replay-safe timeline events.
- The backend event/queue layer is the automation plane that executes work and records outcomes.
- Personal/owner email is part of that private owner plane. Do not turn it into a default admin/client web inbox; use structured DB state to support Discord triage, not to justify duplicating the inbox into the shared product.

Sensitive capabilities must be scoped by actor, not just by channel name.

Owner-only capabilities include:
- private email and personal inbox triage
- desktop or filesystem control
- global supervision across agents
- sensitive approvals and escalation handling

Team-safe capabilities include:
- campaign work
- reporting
- creative review
- ticketing operations
- client-facing collaboration within assigned scope

Concurrency should use resource-level locks, not global "anything is busy" gates.

Examples:
- `tm-browser` for TM One sync and auth refresh
- `eata-browser` for EATA sync and auth refresh
- `gmail-inbox` for Gmail push, history polling, and manual inbox sweeps
- `memory-write` for think-loop prompt and memory mutations
- `discord-owner-actions` only when a privileged owner flow must serialize work in private channels
- When a delegated task cannot run because a required resource is locked, defer and retry it with backoff. Do not convert temporary lock contention into a hard task failure.

Owner Discord should use channel-native operating surfaces, not a second private bot plane.

Examples:
- `#boss` for orchestration, supervision, and direct owner asks
- `#email` for live owner-facing email alerts and actions
- `#meetings` for owner-only calendar scheduling and Google Meet control
- `#email-log` for silent audit history of every email action
- `#approvals` and `#schedule` for explicit control workflows
- Discord intake should accept pasted text plus small text attachments for long-form context. Do not silently drop attachment-only owner asks; either ingest the text or explicitly tell the user the file type is unsupported.
- When an agent needs to hand work or context to another Discord surface, use a structured channel-message action that actually posts into the target channel.
- If another agent must act, the handoff must also go through the runtime task/delegation path instead of relying on webhook messages to be re-read from Discord.
- Do not let agents claim "sent to Boss" or "posted in dashboard" unless the runtime executed the real post, and do not let them claim another agent is working on it unless the runtime queued the handoff.

Background scheduler noise should not spam the owner plane by default.

Examples:
- recurring sync jobs may run silently for cache freshness or internal state
- manual runs can notify the owner because they were explicitly requested
- email handling should always report what action was taken, even when no owner action is required

Email intelligence should follow the same event-driven pattern.

Preferred split:
- Gmail push or history polling creates a bounded mailbox event.
- The email worker reads the full message and thread context, enriches it with business state, and classifies it.
- The worker writes the result into structured tables such as `email_events`, `email_drafts`, and `email_reply_examples`.
- Owner-facing email alerts go to Discord `#email`, and important ones should mention the configured owner IDs.
- Every email action should also write a silent owner-only Discord audit entry to `#email-log`.
- Sent mail should be ingested as learning examples, not treated as another alert stream.
- Those structured email tables are durability and workflow support for the owner Discord surface. They are not a standing requirement to build a mirrored web inbox UI.

Owner scheduling should follow the same owner-plane pattern.

Preferred split:
- Calendar and Google Meet control lives in private Discord `#meetings`, not a default shared web inbox or scheduler UI.
- The meeting worker should prefer the owner's Google OAuth refresh token for Calendar access, with Workspace service-account delegation only as a fallback.
- Reason: Gmail delegation may already work while Calendar domain-wide delegation can lag or fail independently, and meeting automation should not depend on that admin propagation path.
- Direct owner requests to create, move, or cancel meetings count as approval for that calendar action.
- Scheduling actions should report the exact created/updated event details back into Discord so there is no fake "done" state.

Customer WhatsApp should follow the same event-driven pattern.

Preferred split:
- Meta WhatsApp Cloud API webhooks land in the app, not directly in Discord prompts.
- Webhook intake should persist structured records such as `whatsapp_accounts`, `whatsapp_contacts`, `whatsapp_conversations`, and `whatsapp_messages`.
- Every inbound customer message should be able to create a bounded `whatsapp-cloud` agent task plus an internal `system_events` entry.
- Customer conversations should mirror into Discord team/client threads so the team can supervise the relationship in context without re-reading raw webhook payloads.
- WhatsApp is Discord-first. Do not turn it into a default admin/client web inbox or management surface unless a later product decision explicitly asks for that app.
- Admin CRM and client/account surfaces may read CRM-linked WhatsApp summary data such as latest message time, assigned route, linked contact, or conversation status when that improves account management, but they should not become a second full chat client by default.
- Boss should supervise customer-facing WhatsApp responses. Specialists do the domain work, but Boss should assemble the customer-safe answer and the WhatsApp agent should be the customer-facing mouthpiece.
- Evolution transport work is separate from the Discord operating surface. A phone-linked instance can be paired and still not be connected to Outlet if its webhook is pointing somewhere else.
- Evolution-backed WhatsApp should land in the same `whatsapp_accounts`, `whatsapp_contacts`, `whatsapp_conversations`, and `whatsapp_messages` ledger as the older Twilio/Meta paths. Do not build a parallel Evolution-only inbox model.
- Preferred transport shape right now: Evolution webhook -> `/api/whatsapp/evolution`, and agent-approved outbound replies -> secret-guarded `/api/whatsapp/send` so the app remains the single writer for WhatsApp ledger rows and `system_events`.
- For the current WhatsApp lane, prefer a phone-linked Evolution instance over Twilio because it supports real direct chats and real groups on the same account. Keep Twilio only as historical reference in `docs/context/whatsapp-twilio-sender-ops.md`.
- Conversation-to-client and conversation-to-Discord mapping should be explicit and durable on the conversation record. Do not hide that routing inside prompts.
- One WhatsApp conversation should map to one Discord thread under the assigned client/team channel. Unassigned conversations can fall back to `#dashboard` until they are mapped.
- One WhatsApp conversation should also collapse to one latest pending `triage-conversation` task behind the active run. Do not let repeated inbound messages create an unbounded stack of stale pending jobs for the same chat.
- Discord replies inside those client WhatsApp threads should inherit the parent channel lane for routing. Do not route thread messages by the thread title itself.
- Client channel routing should live in shared repo config so the app webhook layer and the Discord worker use the same assignment rules.
- New WhatsApp conversations should be blocked by default until the owner explicitly allows them. Boss should ping the configured owner IDs in `#whatsapp-boss` with the exact conversation id and the owner should decide with `!whatsapp allow <conversationId>` or `!whatsapp deny <conversationId>` there.
- If a WhatsApp group chat is approved, keep it `mention_only` by default. Do not wake the agent on every group message just because the group is approved.
- When using Evolution on a real WhatsApp account, direct messages and group messages should share the same ledger and policy model. Groups are still higher risk than 1:1 and should remain deny-by-default until Jaime approves them.
- If the same personal number needs to be used for both testing and owner control, do not make it silently dual-purpose. Use a strict owner prefix such as `!boss ...` or `!whatsapp ...` on configured owner numbers so the runtime can split Jaime control messages from normal customer-style test traffic.
- The first shipping mode should be restricted: shadow, draft-only, or assisted. Do not default a new customer WhatsApp agent to autonomous outbound replies.
- The customer WhatsApp agent should only see customer-safe context. Do not give it broad internal campaign debate, spend analysis, private owner discussion, or granular campaign structure by default.
- Customer-safe disclosure rules must be explicit per specialist. Media Buyer, Reporting, Creative, Client Manager, Meetings, and Email should each return only the approved customer-safe slice when the destination is WhatsApp. See `docs/context/customer-facing-disclosure-rules.md`.
- If customer-facing outbound replies are enabled later, they should reuse the same durable conversation state and approval trail rather than bypassing the ledger.
- Local Discord/WhatsApp agents should run under a restart loop or process manager, not only an ad hoc foreground shell, so pending conversation work resumes after crashes instead of waiting for a manual restart.

Mailbox organization should be explicit and durable.

Examples:
- Managed Gmail labels should be defined in repo config, not scattered across prompts.
- Filters and label actions should use a real admin script or API path instead of one-off inline shell snippets.
- Labels should encode both relationship (`Clients`, `Outlet Media/Team`, `Cuentas`) and context (`Tours/*`, `Meetings`, `Tech/Alerts`, `Importantes`).

## Internal Growth Teams

Internal customer-acquisition operations should follow the same Discord-first pattern as owner email and customer WhatsApp.

Preferred split:
- Discord is the operating surface for internal growth, creative, paid media, lead ops, and analytics work.
- The app and database are the durable execution and learning layers behind that Discord surface.
- Do not default a new internal growth capability to a web UI just because it needs structured state. Durable tables and task ledgers are enough unless a later product decision explicitly asks for an app.
- Treat growth work as pod-based operations rather than one giant agent swarm.

Preferred pods:
- growth: platform strategy, trend research, content angles, community response
- creative: scripts, video/image generation, packaging, QA
- paid media: campaign structure, ad sets, launch execution, budget changes
- lead ops: inbound triage, qualification, CRM handoff, appointment setting
- analytics: reporting, attribution, experiment scoring
- ops / automation: task dispatch, publishers, browser execution, reliability

Each pod should separate four role types:
- supervisor: decides priorities, routes work, asks for approval when needed
- worker: drafts, analyzes, or prepares assets
- executor: the only role that can publish, send, launch, spend, or mutate live third-party systems
- evaluator: scores outcomes, detects regressions, and promotes repeated wins into shared playbooks

Do not let strategy agents publish directly.
Do not let creator agents spend money directly.
Do not let browser-control agents invent actions on their own.
All live side effects should come from approved structured tasks executed by bounded executor agents.

## Shared Learning Architecture

Prompt text and markdown memory are not enough for a large autonomous team.

The email agent provides the preferred pattern:
- raw event intake
- structured triage ledger
- draft ledger
- real sent-output examples
- owner corrections
- Discord notification and audit trail

Apply the same pattern to new pods with domain-specific ledgers.

Examples:
- growth: trend events, idea drafts, published examples, community corrections, lead outcomes, winning-series playbooks
- creative: creative briefs, draft assets, approved assets, reviewer corrections, performance outcomes, packaging playbooks
- paid media: adset plans, launch drafts, approved changes, operator corrections, measured performance snapshots, optimization playbooks
- lead ops: inbound events, qualification drafts, accepted/rejected handoffs, setter corrections, booked-call outcomes, qualification playbooks

Preferred learning stack:
- markdown memory files for lightweight current notes and operator reminders
- structured examples tables for real sent/published outputs
- corrections tables or ledgers for owner/operator feedback
- outcomes tables for measured business results
- promoted playbooks for patterns supervisors have judged durable enough to reuse

Supervisors should promote durable patterns into shared playbooks.
Workers should read the relevant playbooks and examples, not invent from scratch each time.
Evaluators should score whether the playbooks are still producing good outcomes.

## Notification Discipline

Do not copy owner-facing notification behavior blindly from a narrow domain into every new pod.

Preferred alert layers:
- silent audit log for routine handled work
- supervisor queue for work that needs pod-level judgment
- dashboard summary for trends and batched status
- owner escalation only for high-risk, blocked, urgent, or approval-required work

Scaling the team means reducing alert noise, not increasing message count.

## Preferred Agent Loop

1. Observe an event or explicit user request
2. Load the minimum domain context
3. Decide whether action is needed
4. Draft the next action
5. Request approval if needed
6. Apply the action or create follow-up work
7. Log the outcome back into the system

## Good Agent Inputs

Prefer:
- events
- IDs
- typed records
- campaign state
- asset metadata
- approval status
- client assignments

Avoid depending only on:
- ambiguous chat
- hidden memory
- unstructured pages with no linked entities

## Approval Guidance

Require approval when:
- spending money
- changing live campaign state
- contacting clients externally
- deleting or replacing important records
- taking irreversible actions

Autonomous actions are safest when they are:
- drafts
- suggestions
- internal notifications
- task creation
- classification / routing
- report generation

## Production Hardening

Every production agent workflow should be retry-safe.

That means:
- the trigger event or task should carry correlation and idempotency data when duplicate delivery is possible
- the runtime should be able to run the same task twice without creating duplicate external side effects
- external actions should return structured results that can be logged back into the system

New autonomous workflows should earn autonomy in stages:
- shadow first
- draft-only or assisted next
- live outbound only after logs and evals show the workflow is stable

After wiring the first full slice for a new workflow, stop adding breadth and prove it.
That means verifying one real end-to-end loop, approval gates, visible operator state, and retry-safe side effects before adding another platform, pod, or executor.

Do not treat "the prompt sounds good" as release criteria.
Use fixtures, evals, or repeatable review cases for new workflows that contact customers, mutate campaigns, or spend money.

## Example Patterns

### Asset Pipeline

- `asset_uploaded`
- creative ops agent checks formatting/spec readiness
- if campaign linkage exists, notify campaign owner
- once the linked approval is approved, create `agent_action_requested` for the Meta agent
- Meta agent drafts recommended next step
- approval requested if a live change is needed
- activity feed updated

### Approval Triage

- `approval_requested`
- create or update the linked campaign action item when the approval belongs to a campaign
- if the request is internal operational review, queue a bounded `web-admin` task
- assistant prepares a concise brief or next-step recommendation
- humans still decide through `approval_requests`
- decision is logged back into `system_events`

### Reporting

- `reporting_window_closed`
- reporting agent compiles data
- summary generated
- client-facing explanation written
- internal anomalies highlighted
- report published into the workspace/activity stream

### CRM Follow-Up

- `contact_stage_changed`
- CRM agent checks follow-up rules
- task created or reminder sent
- result logged to activity

### Campaign Action Triage

- `campaign_action_item_created` or `campaign_action_item_updated`
- if the item becomes urgent or enters review, queue a bounded assistant task
- assistant prepares a short operational brief
- the brief supports humans without mutating campaign state on its own

### Campaign Discussion Triage

- `campaign_comment_added`
- if a client starts a new shared campaign thread, queue a bounded assistant task
- assistant summarizes what the client needs and the next best response
- the result helps the team respond faster without auto-replying on the client's behalf

## Logging Requirements

Every agent action should write back:
- trigger event
- agent name
- decision taken
- resulting object or task
- final status
- correlation or causation identifiers when the action is part of a longer workflow

## Build Rule

If an agent workflow cannot be explained as:
- trigger
- context
- decision
- action
- logged outcome

then the workflow is too vague and should be simplified before implementation.
