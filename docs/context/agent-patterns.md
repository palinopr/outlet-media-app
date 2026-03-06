# Agent Patterns

## Agent Role In Outlet

Agents are operational workers inside the system.

They should help move work forward by reacting to structured context, not by replacing the product with chat.

## Control Plane Separation

Do not collapse owner control, employee collaboration, and automation execution into one shared surface.

Preferred split:
- Discord is the owner and team workspace plane, with owner-only channels for private supervision, inbox triage, sensitive approvals, and executive alerts.
- Owner work should stay in private Discord surfaces such as `#boss`, `#email`, `#meetings`, `#email-log`, `#approvals`, and `#schedule`.
- Team collaboration should stay in scoped Discord channels such as `#general`, `#media-buyer`, `#tm-data`, `#creative`, and client channels.
- `#dashboard` is a team work surface, not a bot-only read-only sink. Team members should be able to ask for reporting help there, and those requests can hand off to Boss or other owner workflows when needed.
- Meeting and scheduling requests from team channels should use deterministic runtime handoff to Boss. Do not rely only on a specialist prompt to remember to emit delegation JSON for owner-scheduling workflows.
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

Mailbox organization should be explicit and durable.

Examples:
- Managed Gmail labels should be defined in repo config, not scattered across prompts.
- Filters and label actions should use a real admin script or API path instead of one-off inline shell snippets.
- Labels should encode both relationship (`Clients`, `Outlet Media/Team`, `Cuentas`) and context (`Tours/*`, `Meetings`, `Tech/Alerts`, `Importantes`).

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

## Build Rule

If an agent workflow cannot be explained as:
- trigger
- context
- decision
- action
- logged outcome

then the workflow is too vague and should be simplified before implementation.
