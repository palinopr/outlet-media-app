# Feature Modules

- `src/features/**` is the primary home for app business logic. Prefer feature-owned server modules, mutations, access rules, and view models here.
- Model real product objects first: campaigns, CRM, assets, approvals, reports, conversations, tasks, and agent jobs.
- Keep one shared backbone for admin and client surfaces instead of splitting business behavior by route tree.
- Every meaningful mutation should be traceable and should write the right durable state for `system_events`, `approval_requests`, or the relevant first-class workflow object.
- When a feature pattern becomes repeatable, capture it in `docs/context/` or root `AGENTS.md` before finishing.
