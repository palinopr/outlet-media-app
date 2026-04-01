create or replace function public.record_whatsapp_ticket_concierge_tamper_strike(
  p_wa_id text,
  p_conversation_id uuid,
  p_reason text,
  p_last_inbound_message_id uuid default null,
  p_threshold integer default 3
)
returns table (
  wa_id text,
  strike_count integer,
  banned boolean,
  reason text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
begin
  insert into public.whatsapp_ticket_concierge_bans as bans (
    wa_id,
    conversation_id,
    reason,
    strike_count,
    last_inbound_message_id,
    banned_at,
    created_at,
    updated_at
  )
  values (
    p_wa_id,
    p_conversation_id,
    p_reason,
    1,
    p_last_inbound_message_id,
    v_now,
    v_now,
    v_now
  )
  on conflict (wa_id) do update
  set conversation_id = excluded.conversation_id,
      reason = excluded.reason,
      strike_count = bans.strike_count + 1,
      last_inbound_message_id = coalesce(
        excluded.last_inbound_message_id,
        bans.last_inbound_message_id
      ),
      updated_at = v_now
  returning
    bans.wa_id,
    bans.strike_count,
    bans.strike_count >= greatest(p_threshold, 1),
    bans.reason
  into
    wa_id,
    strike_count,
    banned,
    reason;

  return next;
end;
$$;

revoke all on function public.record_whatsapp_ticket_concierge_tamper_strike(
  text,
  uuid,
  text,
  uuid,
  integer
) from public, anon, authenticated;
grant execute on function public.record_whatsapp_ticket_concierge_tamper_strike(
  text,
  uuid,
  text,
  uuid,
  integer
) to service_role;
