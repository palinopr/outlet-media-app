-- Prevent duplicate access rows for the same Clerk user and client.
create unique index if not exists client_members_client_id_clerk_user_id_uidx
  on public.client_members (client_id, clerk_user_id);
