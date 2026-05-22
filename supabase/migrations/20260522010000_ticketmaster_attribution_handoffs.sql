create table if not exists public.ticketmaster_attribution_handoffs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  click_id text not null,
  session_id text,
  funnel text not null,
  market text,
  cta text,
  ticketmaster_event_id text,
  ticketmaster_event_name text,
  destination_url text,
  source_url text,
  referrer text,
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

create index if not exists ticketmaster_attribution_handoffs_created_at_idx
  on public.ticketmaster_attribution_handoffs (created_at desc);

create index if not exists ticketmaster_attribution_handoffs_click_id_idx
  on public.ticketmaster_attribution_handoffs (click_id, created_at desc);

create index if not exists ticketmaster_attribution_handoffs_session_id_idx
  on public.ticketmaster_attribution_handoffs (session_id, created_at desc)
  where session_id is not null;

create index if not exists ticketmaster_attribution_handoffs_event_created_idx
  on public.ticketmaster_attribution_handoffs (ticketmaster_event_id, created_at desc)
  where ticketmaster_event_id is not null;

create index if not exists ticketmaster_attribution_handoffs_ip_ua_idx
  on public.ticketmaster_attribution_handoffs (request_ip_hash, user_agent_hash, created_at desc)
  where request_ip_hash is not null and user_agent_hash is not null;

create index if not exists ticketmaster_attribution_handoffs_user_agent_idx
  on public.ticketmaster_attribution_handoffs (user_agent_hash, created_at desc)
  where user_agent_hash is not null;

create index if not exists ticketmaster_attribution_handoffs_fbclid_idx
  on public.ticketmaster_attribution_handoffs (fbclid, created_at desc)
  where fbclid is not null;

create index if not exists ticketmaster_attribution_handoffs_fbc_idx
  on public.ticketmaster_attribution_handoffs (fbc, created_at desc)
  where fbc is not null;

create index if not exists ticketmaster_attribution_handoffs_fbp_idx
  on public.ticketmaster_attribution_handoffs (fbp, created_at desc)
  where fbp is not null;

create index if not exists ticketmaster_attribution_handoffs_meta_ad_id_idx
  on public.ticketmaster_attribution_handoffs (meta_ad_id)
  where meta_ad_id is not null;

alter table public.ticketmaster_attribution_handoffs enable row level security;

drop policy if exists ticketmaster_attribution_handoffs_block_user_access on public.ticketmaster_attribution_handoffs;
create policy ticketmaster_attribution_handoffs_block_user_access
  on public.ticketmaster_attribution_handoffs
  for all
  using (false)
  with check (false);

alter table public.ticketmaster_capi_events
  add column if not exists attribution_handoff_id uuid references public.ticketmaster_attribution_handoffs(id) on delete set null,
  add column if not exists attribution_match_method text,
  add column if not exists attribution_match_confidence text,
  add column if not exists attribution_matched_at timestamptz,
  add column if not exists funnel text,
  add column if not exists market text,
  add column if not exists cta text;

update public.ticketmaster_capi_events
set billing_state = null,
    billing_zip = null,
    country = null,
    source_url = null
where billing_state is not null
   or billing_zip is not null
   or country is not null
   or source_url is not null;

-- One-time privacy scrub for legacy attribution values written before the stricter sanitizers.
-- Keep stable numeric Meta IDs, but remove unsafe text/tokens and legacy URLs that may contain PII.
update public.ticketmaster_capi_events
set om_click_id = case when om_click_id ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else om_click_id end,
    om_session_id = case when om_session_id ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else om_session_id end,
    fbclid = case when fbclid ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer)' then null else fbclid end,
    fbc = case when fbc ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer)' then null else fbc end,
    fbp = case when fbp ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer)' then null else fbp end,
    utm_source = case when utm_source ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_source end,
    utm_medium = case when utm_medium ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_medium end,
    utm_campaign = case when utm_campaign ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_campaign end,
    utm_content = case when utm_content ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_content end,
    utm_term = case when utm_term ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_term end,
    meta_campaign_name = case when meta_campaign_name ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else meta_campaign_name end,
    meta_adset_name = case when meta_adset_name ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else meta_adset_name end,
    meta_ad_name = case when meta_ad_name ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else meta_ad_name end
where concat_ws(' ', om_click_id, om_session_id, fbclid, fbc, fbp, utm_source, utm_medium, utm_campaign, utm_content, utm_term, meta_campaign_name, meta_adset_name, meta_ad_name) ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])';

update public.ticketmaster_capi_events
set fbclid = case when fbclid is not null and not (length(fbclid) between 12 and 500 and fbclid ~ '^[A-Za-z0-9_-]+$' and fbclid ~ '[A-Za-z]') then null else fbclid end,
    fbc = case when fbc is not null and not (length(fbc) between 18 and 530 and fbc ~ '^fb[.][0-9]+[.][0-9]{10,13}[.][A-Za-z0-9_.:-]+$') then null else fbc end,
    fbp = case when fbp is not null and not (length(fbp) between 18 and 530 and fbp ~ '^fb[.][0-9]+[.][0-9]{10,13}[.][A-Za-z0-9_.:-]+$') then null else fbp end
where (fbclid is not null and not (length(fbclid) between 12 and 500 and fbclid ~ '^[A-Za-z0-9_-]+$' and fbclid ~ '[A-Za-z]'))
   or (fbc is not null and not (length(fbc) between 18 and 530 and fbc ~ '^fb[.][0-9]+[.][0-9]{10,13}[.][A-Za-z0-9_.:-]+$'))
   or (fbp is not null and not (length(fbp) between 18 and 530 and fbp ~ '^fb[.][0-9]+[.][0-9]{10,13}[.][A-Za-z0-9_.:-]+$'));

update public.ticketmaster_capi_events
set meta_campaign_id = case when meta_campaign_id !~ '^[0-9]{12,30}$' then null else meta_campaign_id end,
    meta_adset_id = case when meta_adset_id !~ '^[0-9]{12,30}$' then null else meta_adset_id end,
    meta_ad_id = case when meta_ad_id !~ '^[0-9]{12,30}$' then null else meta_ad_id end
where (meta_campaign_id is not null and meta_campaign_id !~ '^[0-9]{12,30}$')
   or (meta_adset_id is not null and meta_adset_id !~ '^[0-9]{12,30}$')
   or (meta_ad_id is not null and meta_ad_id !~ '^[0-9]{12,30}$');

update public.ticketmaster_capi_events
set placement = case when placement ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else placement end,
    site_source = case when site_source ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else site_source end
where concat_ws(' ', placement, site_source) ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])';

update public.marketing_attribution_events
set source_url = null,
    landing_url = null,
    click_id = case when click_id ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else click_id end,
    session_id = case when session_id ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else session_id end,
    fbclid = case when fbclid ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer)' then null else fbclid end,
    fbc = case when fbc ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer)' then null else fbc end,
    fbp = case when fbp ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer)' then null else fbp end,
    utm_source = case when utm_source ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_source end,
    utm_medium = case when utm_medium ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_medium end,
    utm_campaign = case when utm_campaign ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_campaign end,
    utm_content = case when utm_content ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_content end,
    utm_term = case when utm_term ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else utm_term end,
    meta_campaign_name = case when meta_campaign_name ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else meta_campaign_name end,
    meta_adset_name = case when meta_adset_name ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else meta_adset_name end,
    meta_ad_name = case when meta_ad_name ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else meta_ad_name end
where source_url is not null
   or landing_url is not null
   or concat_ws(' ', click_id, session_id, fbclid, fbc, fbp, utm_source, utm_medium, utm_campaign, utm_content, utm_term, meta_campaign_name, meta_adset_name, meta_ad_name) ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])';

update public.marketing_attribution_events
set fbclid = case when fbclid is not null and not (length(fbclid) between 12 and 500 and fbclid ~ '^[A-Za-z0-9_-]+$' and fbclid ~ '[A-Za-z]') then null else fbclid end,
    fbc = case when fbc is not null and not (length(fbc) between 18 and 530 and fbc ~ '^fb[.][0-9]+[.][0-9]{10,13}[.][A-Za-z0-9_.:-]+$') then null else fbc end,
    fbp = case when fbp is not null and not (length(fbp) between 18 and 530 and fbp ~ '^fb[.][0-9]+[.][0-9]{10,13}[.][A-Za-z0-9_.:-]+$') then null else fbp end
where (fbclid is not null and not (length(fbclid) between 12 and 500 and fbclid ~ '^[A-Za-z0-9_-]+$' and fbclid ~ '[A-Za-z]'))
   or (fbc is not null and not (length(fbc) between 18 and 530 and fbc ~ '^fb[.][0-9]+[.][0-9]{10,13}[.][A-Za-z0-9_.:-]+$'))
   or (fbp is not null and not (length(fbp) between 18 and 530 and fbp ~ '^fb[.][0-9]+[.][0-9]{10,13}[.][A-Za-z0-9_.:-]+$'));

update public.marketing_attribution_events
set meta_campaign_id = case when meta_campaign_id !~ '^[0-9]{12,30}$' then null else meta_campaign_id end,
    meta_adset_id = case when meta_adset_id !~ '^[0-9]{12,30}$' then null else meta_adset_id end,
    meta_ad_id = case when meta_ad_id !~ '^[0-9]{12,30}$' then null else meta_ad_id end
where (meta_campaign_id is not null and meta_campaign_id !~ '^[0-9]{12,30}$')
   or (meta_adset_id is not null and meta_adset_id !~ '^[0-9]{12,30}$')
   or (meta_ad_id is not null and meta_ad_id !~ '^[0-9]{12,30}$');

update public.marketing_attribution_events
set page_path = case when page_path ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else page_path end,
    placement = case when placement ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else placement end,
    site_source = case when site_source ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else site_source end
where concat_ws(' ', page_path, placement, site_source) ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])';

update public.marketing_attribution_events
set client_event_id = case when client_event_id ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else client_event_id end,
    cta = case when cta ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else cta end,
    market = case when market ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else market end,
    section_id = case when section_id ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then null else section_id end,
    funnel = case when funnel ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])' then 'unknown' else funnel end
where concat_ws(' ', client_event_id, cta, market, section_id, funnel) ~* E'([A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|sk_live|sk_test|xox[baprs]-|ghp_|ya29\\.|access[_-]?token|api[_-]?key|secret|password|bearer|\\+?[0-9][0-9\\s().-]{5,}[0-9])';

create index if not exists ticketmaster_capi_events_funnel_market_event_idx
  on public.ticketmaster_capi_events (ticketmaster_event_id, funnel, market, created_at desc)
  where ticketmaster_event_id is not null and funnel is not null and market is not null;

create index if not exists marketing_attribution_events_ticket_redirect_context_idx
  on public.marketing_attribution_events (request_ip_hash, user_agent_hash, event_name, funnel, market, created_at desc)
  where event_name = 'ticket_redirect' and request_ip_hash is not null and user_agent_hash is not null;

alter table public.ticketmaster_capi_events
  drop constraint if exists ticketmaster_capi_events_attribution_match_confidence_chk;

alter table public.ticketmaster_capi_events
  add constraint ticketmaster_capi_events_attribution_match_confidence_chk
  check (
    attribution_match_confidence is null
    or attribution_match_confidence in ('deterministic', 'high', 'medium', 'low', 'unknown')
  );

create index if not exists ticketmaster_capi_events_attribution_handoff_id_idx
  on public.ticketmaster_capi_events (attribution_handoff_id)
  where attribution_handoff_id is not null;

create index if not exists ticketmaster_capi_events_attribution_match_idx
  on public.ticketmaster_capi_events (attribution_match_confidence, attribution_match_method);
