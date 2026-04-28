-- Retire Events/Reports portal packaging flags while the shipped product is Campaigns-only.
-- Ticket/event ingest tables are intentionally kept as backend data sources for dashboards and linked campaign context.

alter table public.clients
  drop column if exists events_enabled,
  drop column if exists reports_enabled;
