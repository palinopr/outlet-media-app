# Agent Patterns

## Agent Role In Outlet

Agents are operational workers inside the system.

They should help move work forward by reacting to structured context, not by replacing the product with chat.

## Control Plane Separation

Do not collapse owner control, employee collaboration, and automation execution into one shared surface.

Preferred split:
- Telegram is the owner control plane for private supervision, inbox triage, sensitive approvals, and executive alerts.
- Discord is the team workspace plane for specialist agents and employee collaboration.
- The backend event/queue layer is the automation plane that executes work and records outcomes.

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
- if ready for Meta, create `agent_action_requested`
- Meta agent drafts recommended next step
- approval requested if a live change is needed
- activity feed updated

### Approval Triage

- `approval_requested`
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
