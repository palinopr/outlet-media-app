alter table public.clients
add column if not exists events_enabled boolean not null default false;

update public.clients
set events_enabled = true
where exists (
  select 1
  from public.client_services
  where client_services.client_id = clients.id
    and client_services.enabled = true
    and client_services.service_key in ('ticketmaster', 'eata')
)
or exists (
  select 1
  from public.tm_events
  where tm_events.client_slug = clients.slug
);
