create table if not exists public.ticketmaster_capi_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  attempt_count integer not null default 1,
  event_name text not null,
  event_id text not null,
  order_id text,
  order_hash text,
  ticketmaster_event_id text,
  ticketmaster_event_name text,
  ticketmaster_event_date text,
  value numeric(12, 2),
  currency text,
  quantity integer,
  billing_state text,
  billing_zip text,
  country text,
  source_url text,
  request_ip_hash text,
  user_agent_hash text,
  meta_pixel_id text,
  meta_status integer,
  meta_ok boolean not null default false,
  meta_response jsonb,
  skip_reason text,
  error_message text,
  is_test boolean not null default false
);

alter table public.ticketmaster_capi_events enable row level security;

drop policy if exists "ticketmaster_capi_events_block_user_access" on public.ticketmaster_capi_events;
create policy "ticketmaster_capi_events_block_user_access"
  on public.ticketmaster_capi_events
  for all
  using (false)
  with check (false);

create unique index if not exists ticketmaster_capi_events_event_id_idx
  on public.ticketmaster_capi_events (event_id);

create index if not exists ticketmaster_capi_events_created_at_idx
  on public.ticketmaster_capi_events (created_at desc);

create index if not exists ticketmaster_capi_events_order_id_idx
  on public.ticketmaster_capi_events (order_id)
  where order_id is not null;

create index if not exists ticketmaster_capi_events_ticketmaster_event_id_idx
  on public.ticketmaster_capi_events (ticketmaster_event_id)
  where ticketmaster_event_id is not null;
