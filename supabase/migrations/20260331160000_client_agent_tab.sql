alter table public.clients
add column if not exists agent_enabled boolean not null default false;

create unique index if not exists client_members_client_id_id_uidx
  on public.client_members (client_id, id);

create table if not exists public.client_agent_threads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_member_id uuid null,
  title text null,
  preview_text text null,
  referenced_entities jsonb not null default '[]'::jsonb,
  last_response_status text null,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_agent_threads_client_member_match_fkey
    foreign key (client_id, client_member_id)
    references public.client_members(client_id, id)
    on delete set null (client_member_id)
);

create index if not exists client_agent_threads_client_member_id_updated_at_idx
  on public.client_agent_threads (client_member_id, updated_at desc);

drop trigger if exists client_agent_threads_updated_at on public.client_agent_threads;
create trigger client_agent_threads_updated_at
  before update on public.client_agent_threads
  for each row execute procedure public.handle_updated_at();

create table if not exists public.client_agent_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.client_agent_threads(id) on delete cascade,
  role text not null,
  response_status text null,
  text text not null,
  blocks jsonb null,
  referenced_entities jsonb not null default '[]'::jsonb,
  resolved_range jsonb null,
  provider_response_id text null,
  client_generated_id text null,
  created_at timestamptz not null default now(),
  constraint client_agent_messages_role_check
    check (role in ('user', 'assistant')),
  constraint client_agent_messages_response_status_check
    check (response_status in ('answer', 'clarify', 'refuse', 'error'))
);

create index if not exists client_agent_messages_thread_id_created_at_idx
  on public.client_agent_messages (thread_id, created_at asc);

alter table public.client_agent_threads enable row level security;
alter table public.client_agent_messages enable row level security;

drop policy if exists "client_agent_threads_block_user_access" on public.client_agent_threads;
create policy "client_agent_threads_block_user_access"
  on public.client_agent_threads
  for all
  to authenticated, anon
  using (false)
  with check (false);

drop policy if exists "client_agent_messages_block_user_access" on public.client_agent_messages;
create policy "client_agent_messages_block_user_access"
  on public.client_agent_messages
  for all
  to authenticated, anon
  using (false)
  with check (false);
