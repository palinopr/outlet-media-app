CREATE TABLE IF NOT EXISTS public.growth_inbound_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.growth_accounts(id) ON DELETE SET NULL,
  content_job_id uuid REFERENCES public.growth_content_jobs(id) ON DELETE SET NULL,
  post_target_id uuid REFERENCES public.growth_post_targets(id) ON DELETE SET NULL,
  platform text NOT NULL
    CHECK (platform IN ('tiktok', 'youtube', 'instagram', 'x', 'linkedin')),
  source_type text NOT NULL
    CHECK (source_type IN ('comment', 'dm', 'form', 'email', 'call', 'other')),
  sender_handle text,
  sender_display_name text,
  body_text text NOT NULL,
  event_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'triaged', 'ignored', 'converted')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_inbound_events_account_status
  ON public.growth_inbound_events (account_id, status, event_at DESC);

CREATE INDEX IF NOT EXISTS idx_growth_inbound_events_platform_status
  ON public.growth_inbound_events (platform, status, event_at DESC);

CREATE TABLE IF NOT EXISTS public.growth_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inbound_event_id uuid REFERENCES public.growth_inbound_events(id) ON DELETE SET NULL,
  lane_id uuid REFERENCES public.growth_lanes(id) ON DELETE SET NULL,
  source_account_id uuid REFERENCES public.growth_accounts(id) ON DELETE SET NULL,
  platform text
    CHECK (platform IS NULL OR platform IN ('tiktok', 'youtube', 'instagram', 'x', 'linkedin')),
  contact_name text,
  company_name text,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'qualified', 'nurture', 'won', 'lost', 'archived')),
  score integer
    CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  summary text,
  next_action text,
  owner_name text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_leads_status_created_at
  ON public.growth_leads (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_growth_leads_account_status
  ON public.growth_leads (source_account_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_growth_leads_lane_status
  ON public.growth_leads (lane_id, status, created_at DESC);

ALTER TABLE public.growth_inbound_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "growth_inbound_events_read" ON public.growth_inbound_events;
DROP POLICY IF EXISTS "growth_inbound_events_insert" ON public.growth_inbound_events;
DROP POLICY IF EXISTS "growth_inbound_events_update" ON public.growth_inbound_events;
DROP POLICY IF EXISTS "growth_inbound_events_delete" ON public.growth_inbound_events;
DROP POLICY IF EXISTS "growth_leads_read" ON public.growth_leads;
DROP POLICY IF EXISTS "growth_leads_insert" ON public.growth_leads;
DROP POLICY IF EXISTS "growth_leads_update" ON public.growth_leads;
DROP POLICY IF EXISTS "growth_leads_delete" ON public.growth_leads;

CREATE POLICY "growth_inbound_events_read"
  ON public.growth_inbound_events
  FOR SELECT
  USING (false);

CREATE POLICY "growth_inbound_events_insert"
  ON public.growth_inbound_events
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_inbound_events_update"
  ON public.growth_inbound_events
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_inbound_events_delete"
  ON public.growth_inbound_events
  FOR DELETE
  USING (false);

CREATE POLICY "growth_leads_read"
  ON public.growth_leads
  FOR SELECT
  USING (false);

CREATE POLICY "growth_leads_insert"
  ON public.growth_leads
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_leads_update"
  ON public.growth_leads
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_leads_delete"
  ON public.growth_leads
  FOR DELETE
  USING (false);

DROP TRIGGER IF EXISTS growth_inbound_events_updated_at ON public.growth_inbound_events;
CREATE TRIGGER growth_inbound_events_updated_at
  BEFORE UPDATE ON public.growth_inbound_events
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS growth_leads_updated_at ON public.growth_leads;
CREATE TRIGGER growth_leads_updated_at
  BEFORE UPDATE ON public.growth_leads
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
