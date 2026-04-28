-- Remove unused functions from retired remote-only backbones.

drop function if exists public.record_whatsapp_ticket_concierge_tamper_strike(text, uuid, text, uuid, integer);
