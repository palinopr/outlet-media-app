-- Remove retired Ticketmaster/TM1 tables and campaign links.
-- The active product is campaign performance and account/access management only.

alter table if exists public.meta_campaigns
  drop constraint if exists meta_campaigns_tm_event_id_fkey;

alter table if exists public.meta_campaigns
  drop column if exists tm_event_id;

-- Drop dependent ticketing analytics before the root event table.
drop table if exists public.event_snapshots cascade;
drop table if exists public.tm_event_demographics cascade;
drop table if exists public.tm_events cascade;
