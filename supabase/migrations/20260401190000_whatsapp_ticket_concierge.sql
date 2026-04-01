CREATE TABLE IF NOT EXISTS public.whatsapp_ticket_concierge_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  contact_id uuid NULL REFERENCES public.whatsapp_contacts(id) ON DELETE SET NULL,
  latest_inbound_message_id uuid NULL REFERENCES public.whatsapp_messages(id) ON DELETE SET NULL,
  scenario_key text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending_options', 'options_sent', 'checkout_ready', 'inventory_changed', 'no_inventory', 'lookup_failed', 'expired')),
  customer_message text NOT NULL,
  event_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  intent jsonb NOT NULL DEFAULT '{}'::jsonb,
  active_option_set_id uuid NULL,
  last_checkout_url text NULL,
  last_error text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_runs_conversation_updated_at
  ON public.whatsapp_ticket_concierge_runs (conversation_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.whatsapp_ticket_concierge_option_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.whatsapp_ticket_concierge_runs(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  refresh_of_option_set_id uuid NULL REFERENCES public.whatsapp_ticket_concierge_option_sets(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('active', 'selected', 'expired', 'replaced', 'no_inventory', 'lookup_failed')),
  expires_at timestamptz NOT NULL,
  selected_option_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_option_sets_conversation_status_expires_at
  ON public.whatsapp_ticket_concierge_option_sets (conversation_id, status, expires_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_option_sets_id_run_id
  ON public.whatsapp_ticket_concierge_option_sets (id, run_id);

CREATE TABLE IF NOT EXISTS public.whatsapp_ticket_concierge_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  option_set_id uuid NOT NULL REFERENCES public.whatsapp_ticket_concierge_option_sets(id) ON DELETE CASCADE,
  ordinal smallint NOT NULL CHECK (ordinal BETWEEN 1 AND 3),
  label text NOT NULL,
  total_cents bigint NOT NULL,
  section text NOT NULL,
  row text NULL,
  seat_labels jsonb NOT NULL DEFAULT '[]'::jsonb,
  quantity integer NOT NULL,
  note text NOT NULL,
  quote_source text NOT NULL,
  is_under_budget boolean NOT NULL,
  map_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  map_svg text NOT NULL,
  execution jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_options_id_option_set_id
  ON public.whatsapp_ticket_concierge_options (id, option_set_id);

ALTER TABLE public.whatsapp_ticket_concierge_runs
  DROP CONSTRAINT IF EXISTS whatsapp_ticket_concierge_runs_active_option_set_matches_run_fkey;
ALTER TABLE public.whatsapp_ticket_concierge_runs
  ADD CONSTRAINT whatsapp_ticket_concierge_runs_active_option_set_matches_run_fkey
  FOREIGN KEY (active_option_set_id, id)
  REFERENCES public.whatsapp_ticket_concierge_option_sets(id, run_id);

ALTER TABLE public.whatsapp_ticket_concierge_option_sets
  DROP CONSTRAINT IF EXISTS whatsapp_ticket_concierge_option_sets_selected_option_matches_set_fkey;
ALTER TABLE public.whatsapp_ticket_concierge_option_sets
  ADD CONSTRAINT whatsapp_ticket_concierge_option_sets_selected_option_matches_set_fkey
  FOREIGN KEY (selected_option_id, id)
  REFERENCES public.whatsapp_ticket_concierge_options(id, option_set_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_options_option_set_ordinal
  ON public.whatsapp_ticket_concierge_options (option_set_id, ordinal);

CREATE TABLE IF NOT EXISTS public.whatsapp_ticket_concierge_checkout_attempts (
  option_id uuid PRIMARY KEY REFERENCES public.whatsapp_ticket_concierge_options(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'checkout_ready', 'inventory_changed', 'failed')),
  checkout_url text NULL,
  failure_reason text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_ticket_concierge_bans (
  wa_id text PRIMARY KEY,
  conversation_id uuid NULL REFERENCES public.whatsapp_conversations(id) ON DELETE SET NULL,
  reason text NOT NULL,
  strike_count integer NOT NULL DEFAULT 1,
  last_inbound_message_id uuid NULL REFERENCES public.whatsapp_messages(id) ON DELETE SET NULL,
  banned_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_ticket_concierge_bans_updated_at
  ON public.whatsapp_ticket_concierge_bans (updated_at DESC);

ALTER TABLE public.whatsapp_ticket_concierge_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_ticket_concierge_option_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_ticket_concierge_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_ticket_concierge_checkout_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_ticket_concierge_bans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "whatsapp_ticket_concierge_runs_deny_select" ON public.whatsapp_ticket_concierge_runs;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_runs_deny_insert" ON public.whatsapp_ticket_concierge_runs;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_runs_deny_update" ON public.whatsapp_ticket_concierge_runs;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_runs_deny_delete" ON public.whatsapp_ticket_concierge_runs;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_option_sets_deny_select" ON public.whatsapp_ticket_concierge_option_sets;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_option_sets_deny_insert" ON public.whatsapp_ticket_concierge_option_sets;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_option_sets_deny_update" ON public.whatsapp_ticket_concierge_option_sets;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_option_sets_deny_delete" ON public.whatsapp_ticket_concierge_option_sets;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_options_deny_select" ON public.whatsapp_ticket_concierge_options;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_options_deny_insert" ON public.whatsapp_ticket_concierge_options;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_options_deny_update" ON public.whatsapp_ticket_concierge_options;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_options_deny_delete" ON public.whatsapp_ticket_concierge_options;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_checkout_attempts_deny_select" ON public.whatsapp_ticket_concierge_checkout_attempts;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_checkout_attempts_deny_insert" ON public.whatsapp_ticket_concierge_checkout_attempts;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_checkout_attempts_deny_update" ON public.whatsapp_ticket_concierge_checkout_attempts;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_checkout_attempts_deny_delete" ON public.whatsapp_ticket_concierge_checkout_attempts;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_bans_deny_select" ON public.whatsapp_ticket_concierge_bans;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_bans_deny_insert" ON public.whatsapp_ticket_concierge_bans;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_bans_deny_update" ON public.whatsapp_ticket_concierge_bans;
DROP POLICY IF EXISTS "whatsapp_ticket_concierge_bans_deny_delete" ON public.whatsapp_ticket_concierge_bans;

CREATE POLICY "whatsapp_ticket_concierge_runs_deny_select"
  ON public.whatsapp_ticket_concierge_runs
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_runs_deny_insert"
  ON public.whatsapp_ticket_concierge_runs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "whatsapp_ticket_concierge_runs_deny_update"
  ON public.whatsapp_ticket_concierge_runs
  FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_runs_deny_delete"
  ON public.whatsapp_ticket_concierge_runs
  FOR DELETE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_option_sets_deny_select"
  ON public.whatsapp_ticket_concierge_option_sets
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_option_sets_deny_insert"
  ON public.whatsapp_ticket_concierge_option_sets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "whatsapp_ticket_concierge_option_sets_deny_update"
  ON public.whatsapp_ticket_concierge_option_sets
  FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_option_sets_deny_delete"
  ON public.whatsapp_ticket_concierge_option_sets
  FOR DELETE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_options_deny_select"
  ON public.whatsapp_ticket_concierge_options
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_options_deny_insert"
  ON public.whatsapp_ticket_concierge_options
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "whatsapp_ticket_concierge_options_deny_update"
  ON public.whatsapp_ticket_concierge_options
  FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_options_deny_delete"
  ON public.whatsapp_ticket_concierge_options
  FOR DELETE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_checkout_attempts_deny_select"
  ON public.whatsapp_ticket_concierge_checkout_attempts
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_checkout_attempts_deny_insert"
  ON public.whatsapp_ticket_concierge_checkout_attempts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "whatsapp_ticket_concierge_checkout_attempts_deny_update"
  ON public.whatsapp_ticket_concierge_checkout_attempts
  FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_checkout_attempts_deny_delete"
  ON public.whatsapp_ticket_concierge_checkout_attempts
  FOR DELETE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_bans_deny_select"
  ON public.whatsapp_ticket_concierge_bans
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_bans_deny_insert"
  ON public.whatsapp_ticket_concierge_bans
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "whatsapp_ticket_concierge_bans_deny_update"
  ON public.whatsapp_ticket_concierge_bans
  FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "whatsapp_ticket_concierge_bans_deny_delete"
  ON public.whatsapp_ticket_concierge_bans
  FOR DELETE
  TO anon, authenticated
  USING (false);

DROP TRIGGER IF EXISTS whatsapp_ticket_concierge_runs_updated_at ON public.whatsapp_ticket_concierge_runs;
CREATE TRIGGER whatsapp_ticket_concierge_runs_updated_at
  BEFORE UPDATE ON public.whatsapp_ticket_concierge_runs
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS whatsapp_ticket_concierge_option_sets_updated_at ON public.whatsapp_ticket_concierge_option_sets;
CREATE TRIGGER whatsapp_ticket_concierge_option_sets_updated_at
  BEFORE UPDATE ON public.whatsapp_ticket_concierge_option_sets
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS whatsapp_ticket_concierge_checkout_attempts_updated_at ON public.whatsapp_ticket_concierge_checkout_attempts;
CREATE TRIGGER whatsapp_ticket_concierge_checkout_attempts_updated_at
  BEFORE UPDATE ON public.whatsapp_ticket_concierge_checkout_attempts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS whatsapp_ticket_concierge_bans_updated_at ON public.whatsapp_ticket_concierge_bans;
CREATE TRIGGER whatsapp_ticket_concierge_bans_updated_at
  BEFORE UPDATE ON public.whatsapp_ticket_concierge_bans
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
