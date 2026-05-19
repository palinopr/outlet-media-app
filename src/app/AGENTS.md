# App Routes Bootstrap

Canonical engineering and product rules live in [`../../wiki/Home.md`](../../wiki/Home.md), especially [`../../wiki/Engineering-Principles.md`](../../wiki/Engineering-Principles.md) and [`../../wiki/Current-State.md`](../../wiki/Current-State.md).

Local route rules:

- Keep `src/app/**` thin.
- Pages, layouts, route handlers, and server actions should compose feature modules instead of owning business rules directly.
- Do not duplicate campaign or account/access logic in route-local code.
- Meaningful mutations should write the right durable state, usually through shared feature logic and `system_events` or `admin_activity`.
