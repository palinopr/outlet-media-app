CREATE TABLE IF NOT EXISTS public.growth_publish_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_target_id uuid NOT NULL REFERENCES public.growth_post_targets(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.growth_accounts(id) ON DELETE SET NULL,
  platform text NOT NULL
    CHECK (platform IN ('tiktok', 'youtube', 'instagram', 'x', 'linkedin')),
  status text NOT NULL DEFAULT 'awaiting_approval'
    CHECK (status IN ('awaiting_approval', 'approved', 'rejected', 'manual_post', 'published', 'failed', 'cancelled')),
  requested_by_agent text,
  approved_by text,
  note text,
  manual_instructions text,
  publish_url text,
  platform_post_id text,
  error_message text,
  published_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_publish_attempts_target_status
  ON public.growth_publish_attempts (post_target_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_growth_publish_attempts_account_status
  ON public.growth_publish_attempts (account_id, status, created_at DESC);

ALTER TABLE public.growth_publish_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "growth_publish_attempts_read" ON public.growth_publish_attempts;
DROP POLICY IF EXISTS "growth_publish_attempts_insert" ON public.growth_publish_attempts;
DROP POLICY IF EXISTS "growth_publish_attempts_update" ON public.growth_publish_attempts;
DROP POLICY IF EXISTS "growth_publish_attempts_delete" ON public.growth_publish_attempts;

CREATE POLICY "growth_publish_attempts_read"
  ON public.growth_publish_attempts
  FOR SELECT
  USING (false);

CREATE POLICY "growth_publish_attempts_insert"
  ON public.growth_publish_attempts
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_publish_attempts_update"
  ON public.growth_publish_attempts
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_publish_attempts_delete"
  ON public.growth_publish_attempts
  FOR DELETE
  USING (false);

DROP TRIGGER IF EXISTS growth_publish_attempts_updated_at ON public.growth_publish_attempts;
CREATE TRIGGER growth_publish_attempts_updated_at
  BEFORE UPDATE ON public.growth_publish_attempts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
