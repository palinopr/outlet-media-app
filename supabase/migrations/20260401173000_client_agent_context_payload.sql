alter table public.client_agent_messages
add column if not exists context_payload jsonb null;
