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
