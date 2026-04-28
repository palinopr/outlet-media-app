-- Remove inactive backbones that no longer have product or runtime code paths.
-- Campaigns, client accounts, memberships, invitations, Meta campaign data, system events, and admin activity remain.

drop table if exists public.email_drafts cascade;
drop table if exists public.email_reply_examples cascade;
drop table if exists public.email_events cascade;

drop table if exists public.crm_comments cascade;
drop table if exists public.crm_follow_up_items cascade;
drop table if exists public.crm_contacts cascade;

drop table if exists public.workspace_comments cascade;
drop table if exists public.workspace_tasks cascade;
drop table if exists public.workspace_pages cascade;

drop table if exists public.notifications cascade;
drop table if exists public.client_member_events cascade;
