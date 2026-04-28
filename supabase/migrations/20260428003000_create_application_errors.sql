-- Lightweight app error ledger for production smoke and operator visibility.

create table if not exists public.application_errors (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'client' check (source in ('client', 'server')),
  level text not null default 'error' check (level in ('error', 'warning', 'info')),
  route text,
  message text not null,
  digest text,
  stack text,
  user_id text,
  user_email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.application_errors enable row level security;

create index if not exists application_errors_created_at_idx
  on public.application_errors (created_at desc);

create index if not exists application_errors_digest_idx
  on public.application_errors (digest)
  where digest is not null;
