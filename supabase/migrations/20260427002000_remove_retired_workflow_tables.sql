-- Remove retired workflow/comment/asset surfaces from the Campaigns-only baseline.
-- Ticketmaster event ingest tables stay for backend campaign context; these UI/workflow ledgers are no longer active.

drop table if exists public.notifications cascade;
drop table if exists public.approval_requests cascade;
drop table if exists public.campaign_action_items cascade;
drop table if exists public.campaign_comments cascade;
drop table if exists public.asset_comments cascade;
drop table if exists public.event_comments cascade;
drop table if exists public.asset_follow_up_items cascade;
drop table if exists public.event_follow_up_items cascade;
drop table if exists public.ad_assets cascade;
drop table if exists public.asset_sources cascade;
drop table if exists public.client_member_events cascade;
