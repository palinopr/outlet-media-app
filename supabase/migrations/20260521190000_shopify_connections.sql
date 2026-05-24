create table if not exists public.shopify_connections (
  id uuid primary key default gen_random_uuid(),
  shop_domain text not null unique,
  access_token_encrypted text not null,
  scopes text[] not null default '{}',
  connected_at timestamptz not null default now(),
  last_used_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shopify_connections_status_idx
  on public.shopify_connections (status);

create trigger shopify_connections_updated_at
  before update on public.shopify_connections
  for each row
  execute function public.handle_updated_at();
