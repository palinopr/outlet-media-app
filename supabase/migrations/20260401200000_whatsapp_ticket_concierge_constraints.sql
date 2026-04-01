ALTER TABLE public.whatsapp_ticket_concierge_runs
  DROP CONSTRAINT IF EXISTS whatsapp_ticket_concierge_runs_active_option_set_id_fkey;
ALTER TABLE public.whatsapp_ticket_concierge_runs
  ADD CONSTRAINT whatsapp_ticket_concierge_runs_active_option_set_id_fkey
  FOREIGN KEY (active_option_set_id)
  REFERENCES public.whatsapp_ticket_concierge_option_sets(id)
  ON DELETE SET NULL;

ALTER TABLE public.whatsapp_ticket_concierge_option_sets
  DROP CONSTRAINT IF EXISTS whatsapp_ticket_concierge_option_sets_selected_option_id_fkey;
ALTER TABLE public.whatsapp_ticket_concierge_option_sets
  ADD CONSTRAINT whatsapp_ticket_concierge_option_sets_selected_option_id_fkey
  FOREIGN KEY (selected_option_id)
  REFERENCES public.whatsapp_ticket_concierge_options(id)
  ON DELETE SET NULL;

DROP INDEX IF EXISTS public.idx_whatsapp_ticket_concierge_options_option_set_ordinal;
CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_options_option_set_ordinal
  ON public.whatsapp_ticket_concierge_options (option_set_id, ordinal);
