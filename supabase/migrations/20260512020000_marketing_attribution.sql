create table if not exists public.marketing_attribution_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null,
  funnel text not null,
  market text,
  session_id text,
  click_id text,
  cta text,
  source_url text,
  landing_url text,
  referrer text,
  page_path text,
  fbclid text,
  fbp text,
  fbc text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  meta_campaign_id text,
  meta_campaign_name text,
  meta_adset_id text,
  meta_adset_name text,
  meta_ad_id text,
  meta_ad_name text,
  placement text,
  site_source text,
  request_ip_hash text,
  user_agent_hash text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists marketing_attribution_events_created_at_idx
  on public.marketing_attribution_events (created_at desc);

create index if not exists marketing_attribution_events_session_id_idx
  on public.marketing_attribution_events (session_id);

create index if not exists marketing_attribution_events_click_id_idx
  on public.marketing_attribution_events (click_id);

create index if not exists marketing_attribution_events_meta_ad_id_idx
  on public.marketing_attribution_events (meta_ad_id);

alter table public.marketing_attribution_events enable row level security;

drop policy if exists marketing_attribution_events_block_user_access on public.marketing_attribution_events;
create policy marketing_attribution_events_block_user_access
  on public.marketing_attribution_events
  for all
  using (false)
  with check (false);

alter table public.ticketmaster_capi_events
  add column if not exists om_session_id text,
  add column if not exists om_click_id text,
  add column if not exists fbclid text,
  add column if not exists fbp text,
  add column if not exists fbc text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists meta_campaign_id text,
  add column if not exists meta_campaign_name text,
  add column if not exists meta_adset_id text,
  add column if not exists meta_adset_name text,
  add column if not exists meta_ad_id text,
  add column if not exists meta_ad_name text,
  add column if not exists placement text,
  add column if not exists site_source text;

create index if not exists ticketmaster_capi_events_om_click_id_idx
  on public.ticketmaster_capi_events (om_click_id);

create index if not exists ticketmaster_capi_events_meta_ad_id_idx
  on public.ticketmaster_capi_events (meta_ad_id);
