# Agent Runtime

- The `agent/` tree is the Discord-first control plane. Do not add parallel web surfaces for owner email, owner meetings, or customer WhatsApp unless product direction explicitly changes.
- Prefer bounded workers with explicit triggers, approvals, outcome logging, and durable follow-up state.
- New agent behavior should land as clear services, events, jobs, prompts, or memory updates instead of hidden prompt branching.
- When an agent produces a blocker, recommendation, or failure, make it recoverable as first-class follow-up work rather than a passive log line.
- Keep prompts, memory, and runtime behavior aligned. If the operating pattern changes, update durable docs in the same pass.
- Model new internal autonomous teams as pods with explicit agent roles: `supervisor`, `worker`, `executor`, or `evaluator`.
- Supervisors route and approve. Workers draft or analyze. Executors are the only agents allowed to touch live external systems. Evaluators score outcomes and promote repeated wins into durable playbooks.
- Reuse the email-agent learning pattern for new pods: structured ledgers for raw events, drafts, sent/published examples, owner corrections, measured outcomes, and promoted playbooks. Markdown memory files are secondary notes, not the only learning store.
- Every autonomous flow should read as: trigger -> scoped context load -> structured decision -> approval if needed -> executor side effect -> ledger writeback -> outcome event -> learning update.
