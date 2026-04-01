CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_option_sets_id_run_id
  ON public.whatsapp_ticket_concierge_option_sets (id, run_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_options_id_option_set_id
  ON public.whatsapp_ticket_concierge_options (id, option_set_id);

ALTER TABLE public.whatsapp_ticket_concierge_runs
  DROP CONSTRAINT IF EXISTS whatsapp_ticket_concierge_runs_active_option_set_id_fkey;
ALTER TABLE public.whatsapp_ticket_concierge_runs
  DROP CONSTRAINT IF EXISTS whatsapp_ticket_concierge_runs_active_option_set_matches_run_fkey;
ALTER TABLE public.whatsapp_ticket_concierge_runs
  ADD CONSTRAINT whatsapp_ticket_concierge_runs_active_option_set_matches_run_fkey
  FOREIGN KEY (active_option_set_id, id)
  REFERENCES public.whatsapp_ticket_concierge_option_sets(id, run_id);

ALTER TABLE public.whatsapp_ticket_concierge_option_sets
  DROP CONSTRAINT IF EXISTS whatsapp_ticket_concierge_option_sets_selected_option_id_fkey;
ALTER TABLE public.whatsapp_ticket_concierge_option_sets
  DROP CONSTRAINT IF EXISTS whatsapp_ticket_concierge_option_sets_selected_option_matches_set_fkey;
ALTER TABLE public.whatsapp_ticket_concierge_option_sets
  ADD CONSTRAINT whatsapp_ticket_concierge_option_sets_selected_option_matches_set_fkey
  FOREIGN KEY (selected_option_id, id)
  REFERENCES public.whatsapp_ticket_concierge_options(id, option_set_id);
