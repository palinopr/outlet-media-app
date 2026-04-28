# Agent Runtime Retirement

Outlet's web product does not currently ship an agent runtime, agent chat surface, or client-facing Agent tab.

The prior Discord/runtime implementation, web agent endpoints, client agent chat, agent outcome loaders, and agent task tables were removed during the April 2026 cleanup. Do not rebuild them by default.

If agents return later, they should be reintroduced as a deliberate product decision with a small, event-driven slice, clear approval boundaries, durable ledgers, and tests. Until then, keep the web product focused on Campaigns and the minimal admin/account objects needed to support them.
