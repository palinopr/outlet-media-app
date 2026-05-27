create table if not exists public.tiktok_connections (
  id uuid primary key default gen_random_uuid(),
  advertiser_id text not null unique,
  advertiser_name text,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  open_id text,
  scopes text[] not null default '{}',
  token_expires_at timestamptz,
  refresh_token_expires_at timestamptz,
  connected_at timestamptz not null default now(),
  last_used_at timestamptz,
  status text not null default 'active'
    check (status in ('active', 'revoked', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tiktok_connections_status_idx
  on public.tiktok_connections (status);

create trigger tiktok_connections_updated_at
  before update on public.tiktok_connections
  for each row
  execute function public.handle_updated_at();
