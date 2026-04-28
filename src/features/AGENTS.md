# Feature Modules

- `src/features/**` is the primary home for app business logic. Prefer feature-owned server modules, mutations, access rules, and view models here.
- Model real product objects first. In the current baseline, Campaigns and account/access objects are the active product surface; Events, Reports, and broad conversation surfaces are retired unless explicitly restored.
- Keep one shared backbone for admin and client surfaces instead of splitting business behavior by route tree.
- Every meaningful mutation should be traceable and should write the right durable state for `system_events` or the relevant first-class product object.
- When a feature pattern becomes repeatable, capture it in `docs/context/` or root `AGENTS.md` before finishing.
