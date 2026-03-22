alter table public.clients
add column if not exists reports_enabled boolean not null default true,
add column if not exists portal_brand_name text,
add column if not exists portal_logo_url text,
add column if not exists portal_logo_alt text;

create table if not exists public.client_access_invites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  email text not null,
  client_role text not null default 'member',
  status text not null default 'pending',
  clerk_invitation_id text,
  accepted_by_clerk_user_id text,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_access_invites_client_role_check
    check (client_role in ('owner', 'member')),
  constraint client_access_invites_status_check
    check (status in ('pending', 'accepted', 'expired', 'revoked'))
);

create index if not exists client_access_invites_client_id_idx
  on public.client_access_invites (client_id);

create index if not exists client_access_invites_clerk_invitation_id_idx
  on public.client_access_invites (clerk_invitation_id);

create index if not exists client_access_invites_email_idx
  on public.client_access_invites (lower(email));

create unique index if not exists client_access_invites_pending_email_uidx
  on public.client_access_invites (client_id, lower(email))
  where status = 'pending' and accepted_at is null and revoked_at is null;

alter table public.client_access_invites enable row level security;

drop trigger if exists client_access_invites_updated_at on public.client_access_invites;
create trigger client_access_invites_updated_at
  before update on public.client_access_invites
  for each row execute procedure public.handle_updated_at();
