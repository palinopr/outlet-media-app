# App Routes

- Keep `src/app/**` thin. Pages, layouts, route handlers, and server actions should compose feature modules instead of owning business rules directly.
- Put shared data loading, mutations, access rules, and view-model shaping in `src/features/**`.
- Do not let route-local code become the only place that knows how a campaign, CRM item, asset, approval, or report behaves.
- Meaningful mutations should still emit or attach to the right first-class product records such as `system_events` and `approval_requests`.
- If route code starts duplicating logic already needed by admin and client surfaces, extract it instead of extending the duplication.
