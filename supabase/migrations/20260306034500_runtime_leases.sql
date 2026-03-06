create or replace function public.acquire_runtime_lease(
  p_key text,
  p_holder text,
  p_ttl_seconds integer,
  p_meta jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_expires timestamptz := now() + make_interval(secs => greatest(p_ttl_seconds, 1));
begin
  insert into public.agent_runtime_state (key, value, updated_at)
  values (
    p_key,
    jsonb_build_object(
      'holder', p_holder,
      'acquired_at', v_now,
      'expires_at', v_expires,
      'meta', coalesce(p_meta, '{}'::jsonb)
    ),
    v_now
  )
  on conflict (key) do update
  set value = jsonb_build_object(
        'holder', p_holder,
        'acquired_at',
        case
          when public.agent_runtime_state.value->>'holder' = p_holder
            then coalesce((public.agent_runtime_state.value->>'acquired_at')::timestamptz, v_now)
          else v_now
        end,
        'expires_at', v_expires,
        'meta', coalesce(p_meta, '{}'::jsonb)
      ),
      updated_at = v_now
  where
    public.agent_runtime_state.value is null
    or nullif(public.agent_runtime_state.value->>'expires_at', '') is null
    or (public.agent_runtime_state.value->>'expires_at')::timestamptz <= v_now
    or public.agent_runtime_state.value->>'holder' = p_holder;

  return found;
end;
$$;

create or replace function public.release_runtime_lease(
  p_key text,
  p_holder text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.agent_runtime_state
  where key = p_key
    and value->>'holder' = p_holder;

  return found;
end;
$$;
