alter table public.notifications
  add column if not exists client_slug text,
  add column if not exists entity_type text,
  add column if not exists entity_id text;

create index if not exists notifications_user_read_created_idx
  on public.notifications (user_id, read, created_at desc);

create index if not exists notifications_entity_idx
  on public.notifications (entity_type, entity_id);
