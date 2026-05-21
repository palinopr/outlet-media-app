alter table public.marketing_attribution_events
  add column if not exists section_id text,
  add column if not exists scroll_depth_pct integer,
  add column if not exists visible_ratio numeric(5,4),
  add column if not exists viewport_width integer,
  add column if not exists viewport_height integer,
  add column if not exists device_type text,
  add column if not exists viewport_orientation text,
  add column if not exists sample_rate numeric(6,5) not null default 1,
  add column if not exists client_event_id text;

create index if not exists marketing_attribution_events_funnel_market_created_at_idx
  on public.marketing_attribution_events (funnel, market, created_at desc);

create index if not exists marketing_attribution_events_event_name_created_at_idx
  on public.marketing_attribution_events (event_name, created_at desc);

create index if not exists marketing_attribution_events_section_id_idx
  on public.marketing_attribution_events (section_id)
  where section_id is not null;

create index if not exists marketing_attribution_events_cta_idx
  on public.marketing_attribution_events (cta)
  where cta is not null;

create index if not exists marketing_attribution_events_client_event_id_idx
  on public.marketing_attribution_events (client_event_id)
  where client_event_id is not null;

create index if not exists marketing_attribution_events_capi_match_idx
  on public.marketing_attribution_events (
    request_ip_hash,
    user_agent_hash,
    created_at desc
  )
  where event_name in ('ticket_redirect', 'ticket_click');
