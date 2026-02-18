-- Outlet Media x Zamora - Supabase Schema
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================================
-- Events from Ticketmaster (scraped by local agent)
-- ============================================================
create table if not exists public.tm_events (
  id            uuid primary key default gen_random_uuid(),
  tm_id         text not null unique,       -- Ticketmaster event ID (used for upsert)
  tm1_number    text not null default '',   -- Human-readable TM1 number
  name          text not null default '',
  artist        text not null default '',
  venue         text not null default '',
  city          text not null default '',
  date          timestamptz,
  status        text not null default '',   -- onsale | presale | offsale | cancelled
  tickets_sold  integer,
  tickets_available integer,
  gross         integer,                    -- Revenue in cents
  url           text not null default '',
  scraped_at    timestamptz not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tm_events_updated_at
  before update on public.tm_events
  for each row execute procedure public.handle_updated_at();

-- Indexes
create index if not exists tm_events_date_idx on public.tm_events (date);
create index if not exists tm_events_status_idx on public.tm_events (status);

-- ============================================================
-- Meta Campaigns (from Meta Marketing API)
-- ============================================================
create table if not exists public.meta_campaigns (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     text not null unique,     -- Meta campaign ID
  name            text not null default '',
  status          text not null default '',
  objective       text not null default '',
  daily_budget    bigint,                   -- In cents
  lifetime_budget bigint,                   -- In cents
  spend           bigint,                   -- Total spend in cents
  impressions     bigint,
  clicks          bigint,
  reach           bigint,
  cpm             numeric(10,4),
  cpc             numeric(10,4),
  ctr             numeric(10,6),
  roas            numeric(10,4),
  client_slug     text,                     -- Which client this belongs to (e.g. "zamora")
  tm_event_id     uuid references public.tm_events(id),  -- Link to TM event if applicable
  synced_at       timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger meta_campaigns_updated_at
  before update on public.meta_campaigns
  for each row execute procedure public.handle_updated_at();

create index if not exists meta_campaigns_client_idx on public.meta_campaigns (client_slug);
create index if not exists meta_campaigns_status_idx on public.meta_campaigns (status);

-- ============================================================
-- Agent Jobs (written by web app, polled by local agent)
-- ============================================================
create table if not exists public.agent_jobs (
  id          uuid primary key default gen_random_uuid(),
  agent_id    text not null,              -- tm-monitor | meta-ads | campaign-monitor
  status      text not null default 'pending', -- pending | running | done | error
  prompt      text,                       -- optional custom prompt override
  result      text,                       -- agent output text
  error       text,                       -- error message if status=error
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  started_at  timestamptz,
  finished_at timestamptz
);

create trigger agent_jobs_updated_at
  before update on public.agent_jobs
  for each row execute procedure public.handle_updated_at();

create index if not exists agent_jobs_status_idx on public.agent_jobs (status);
create index if not exists agent_jobs_agent_idx  on public.agent_jobs (agent_id, created_at desc);

alter table public.agent_jobs enable row level security;

-- Web app (service role) can read/write. Anon key cannot.
create policy "jobs_read"   on public.agent_jobs for select using (true);
create policy "jobs_insert" on public.agent_jobs for insert with check (false);
create policy "jobs_update" on public.agent_jobs for update using (false);

-- ============================================================
-- Row Level Security (RLS)
-- Enable so anon key (client-side) can only read, not write
-- Writes go through service role key (server-side only)
-- ============================================================
alter table public.tm_events enable row level security;
alter table public.meta_campaigns enable row level security;

-- Anyone can read events (will be behind Clerk auth at app level)
create policy "events_read" on public.tm_events
  for select using (true);

-- Only service role can write (enforced by only using service role on server)
create policy "events_insert" on public.tm_events
  for insert with check (false);  -- blocked for anon, service role bypasses RLS

create policy "events_update" on public.tm_events
  for update using (false);

create policy "campaigns_read" on public.meta_campaigns
  for select using (true);

create policy "campaigns_insert" on public.meta_campaigns
  for insert with check (false);

create policy "campaigns_update" on public.meta_campaigns
  for update using (false);
