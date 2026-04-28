-- Retire the unfinished agent product/runtime surfaces.
-- Keep historical migrations intact, but remove the active database artifacts they created.

begin;

-- Remove client-facing and runtime ledgers before dropping their tables.
delete from public.system_events
where event_name = 'agent_action_requested'
   or event_name like 'client_agent_%'
   or entity_type = 'agent_task';

update public.system_events
set actor_type = 'system',
    actor_name = coalesce(nullif(actor_name, 'Outlet Agent'), 'Outlet Team')
where actor_type = 'agent';

drop index if exists public.idx_system_events_agent_task_visibility;

alter table public.system_events
  drop constraint if exists system_events_actor_type_check;

alter table public.system_events
  add constraint system_events_actor_type_check
  check (actor_type in ('user', 'system'));

drop function if exists public.acquire_runtime_lease(text, text, integer, jsonb);
drop function if exists public.release_runtime_lease(text, text);

drop table if exists public.client_agent_messages cascade;
drop table if exists public.client_agent_threads cascade;
drop table if exists public.agent_tasks cascade;
drop table if exists public.agent_runtime_state cascade;
drop table if exists public.agent_jobs cascade;
drop table if exists public.agent_alerts cascade;

alter table public.clients
  drop column if exists agent_enabled;

alter table public.growth_publish_attempts
  drop column if exists requested_by_agent;

commit;
