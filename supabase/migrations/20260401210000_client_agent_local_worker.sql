alter table public.client_agent_threads
  add column if not exists viewer_context text not null default 'member',
  add column if not exists preview_admin_user_id text null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'client_agent_threads_viewer_context_check'
      and conrelid = 'public.client_agent_threads'::regclass
  ) then
    alter table public.client_agent_threads
      add constraint client_agent_threads_viewer_context_check
      check (viewer_context in ('member', 'admin_preview'));
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'client_agent_threads_viewer_owner_check'
      and conrelid = 'public.client_agent_threads'::regclass
  ) then
    alter table public.client_agent_threads
      add constraint client_agent_threads_viewer_owner_check
      check (
        (
          viewer_context = 'member'
          and client_member_id is not null
          and preview_admin_user_id is null
        )
        or (
          viewer_context = 'admin_preview'
          and client_member_id is null
          and preview_admin_user_id is not null
        )
      );
  end if;
end;
$$;

create index if not exists client_agent_threads_preview_lookup_idx
  on public.client_agent_threads (client_id, preview_admin_user_id, updated_at desc)
  where viewer_context = 'admin_preview';

alter table public.client_agent_messages
  add column if not exists agent_task_id text null,
  add column if not exists client_request_id text null;

alter table public.client_agent_messages
  drop constraint if exists client_agent_messages_response_status_check;

alter table public.client_agent_messages
  add constraint client_agent_messages_response_status_check
  check (response_status in ('answer', 'clarify', 'refuse', 'error', 'pending'));

create unique index if not exists client_agent_messages_user_request_uidx
  on public.client_agent_messages (thread_id, client_request_id)
  where role = 'user' and client_request_id is not null;

create index if not exists client_agent_messages_agent_task_id_idx
  on public.client_agent_messages (agent_task_id)
  where agent_task_id is not null;

create or replace function public.queue_client_agent_turn(
  p_thread_id uuid,
  p_client_slug text,
  p_viewer_context text,
  p_client_member_id uuid default null,
  p_preview_admin_user_id text default null,
  p_client_request_id text,
  p_text text
)
returns table (
  thread_id uuid,
  client_request_id text,
  user_message_id uuid,
  assistant_message_id uuid,
  agent_task_id text,
  was_existing boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
begin
  select
    user_row.id,
    assistant_row.id,
    assistant_row.agent_task_id
  into
    user_message_id,
    assistant_message_id,
    agent_task_id
  from public.client_agent_messages as user_row
  join public.client_agent_messages as assistant_row
    on assistant_row.thread_id = user_row.thread_id
   and assistant_row.client_request_id = user_row.client_request_id
   and assistant_row.role = 'assistant'
  where user_row.thread_id = p_thread_id
    and user_row.client_request_id = p_client_request_id
    and user_row.role = 'user'
  limit 1;

  if found then
    thread_id := p_thread_id;
    client_request_id := p_client_request_id;
    was_existing := true;
    return next;
    return;
  end if;

  insert into public.client_agent_messages (
    thread_id,
    role,
    response_status,
    text,
    blocks,
    referenced_entities,
    resolved_range,
    provider_response_id,
    client_generated_id,
    agent_task_id,
    client_request_id,
    created_at
  )
  values (
    p_thread_id,
    'user',
    null,
    p_text,
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    null,
    null,
    null,
    p_client_request_id,
    v_now
  )
  on conflict (thread_id, client_request_id) where role = 'user' and client_request_id is not null
  do nothing
  returning id into user_message_id;

  if user_message_id is null then
    select
      user_row.id,
      assistant_row.id,
      assistant_row.agent_task_id
    into
      user_message_id,
      assistant_message_id,
      agent_task_id
    from public.client_agent_messages as user_row
    join public.client_agent_messages as assistant_row
      on assistant_row.thread_id = user_row.thread_id
     and assistant_row.client_request_id = user_row.client_request_id
     and assistant_row.role = 'assistant'
    where user_row.thread_id = p_thread_id
      and user_row.client_request_id = p_client_request_id
      and user_row.role = 'user'
    limit 1;

    if found then
      thread_id := p_thread_id;
      client_request_id := p_client_request_id;
      was_existing := true;
      return next;
      return;
    end if;

    raise exception 'client_agent_turn queue retry observed without durable rows';
  end if;

  insert into public.agent_tasks (
    from_agent,
    to_agent,
    action,
    params,
    tier,
    status
  )
  values (
    'client-portal',
    'client-agent',
    'reply',
    jsonb_build_object(
      'clientSlug', p_client_slug,
      'threadId', p_thread_id::text,
      'userMessageId', user_message_id::text,
      'assistantMessageId', null,
      'viewerContext', p_viewer_context,
      'clientMemberId', case when p_client_member_id is null then null else p_client_member_id::text end,
      'previewAdminUserId', p_preview_admin_user_id
    ),
    'green',
    'pending'
  )
  returning id into agent_task_id;

  insert into public.client_agent_messages (
    thread_id,
    role,
    response_status,
    text,
    blocks,
    referenced_entities,
    resolved_range,
    provider_response_id,
    client_generated_id,
    agent_task_id,
    client_request_id,
    created_at
  )
  values (
    p_thread_id,
    'assistant',
    'pending',
    'Thinking…',
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    null,
    null,
    agent_task_id,
    p_client_request_id,
    v_now
  )
  returning id into assistant_message_id;

  update public.agent_tasks
    set params = jsonb_build_object(
      'clientSlug', p_client_slug,
      'threadId', p_thread_id::text,
      'userMessageId', user_message_id::text,
      'assistantMessageId', assistant_message_id::text,
      'viewerContext', p_viewer_context,
      'clientMemberId', case when p_client_member_id is null then null else p_client_member_id::text end,
      'previewAdminUserId', p_preview_admin_user_id
    )
  where id = agent_task_id;

  update public.client_agent_threads
    set last_response_status = 'pending',
        preview_text = 'Thinking…',
        last_message_at = v_now,
        updated_at = v_now
    where id = p_thread_id;

  thread_id := p_thread_id;
  client_request_id := p_client_request_id;
  was_existing := false;
  return next;
end;
$$;
