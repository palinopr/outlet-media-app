CREATE TABLE IF NOT EXISTS public.growth_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL
    CHECK (platform IN ('tiktok', 'youtube', 'instagram', 'x', 'linkedin')),
  label text NOT NULL,
  handle text,
  profile_url text,
  owner_kind text NOT NULL DEFAULT 'outlet'
    CHECK (owner_kind IN ('outlet', 'partner', 'creator')),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'restricted', 'archived')),
  operating_mode text NOT NULL DEFAULT 'draft_only'
    CHECK (operating_mode IN ('shadow', 'draft_only', 'assisted', 'live')),
  primary_channel_name text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT growth_accounts_platform_handle_key UNIQUE (platform, handle)
);

CREATE INDEX IF NOT EXISTS idx_growth_accounts_platform_status
  ON public.growth_accounts (platform, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_growth_accounts_channel
  ON public.growth_accounts (primary_channel_name, created_at DESC);

CREATE TABLE IF NOT EXISTS public.growth_lanes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'archived')),
  primary_offer text,
  audience_summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_lanes_status
  ON public.growth_lanes (status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.growth_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lane_id uuid REFERENCES public.growth_lanes(id) ON DELETE SET NULL,
  source_account_id uuid REFERENCES public.growth_accounts(id) ON DELETE SET NULL,
  title text NOT NULL,
  source_type text NOT NULL DEFAULT 'manual'
    CHECK (source_type IN ('manual', 'trend', 'competitor', 'comment', 'dm', 'analytics', 'ai')),
  status text NOT NULL DEFAULT 'proposed'
    CHECK (status IN ('proposed', 'accepted', 'rejected', 'archived')),
  raw_notes text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_ideas_lane_status
  ON public.growth_ideas (lane_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_growth_ideas_source_account
  ON public.growth_ideas (source_account_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.growth_content_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES public.growth_ideas(id) ON DELETE SET NULL,
  lane_id uuid REFERENCES public.growth_lanes(id) ON DELETE SET NULL,
  primary_account_id uuid REFERENCES public.growth_accounts(id) ON DELETE SET NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'brief'
    CHECK (status IN ('brief', 'scripting', 'producing', 'review', 'approved', 'scheduled', 'published', 'failed', 'archived')),
  operating_mode text NOT NULL DEFAULT 'draft_only'
    CHECK (operating_mode IN ('shadow', 'draft_only', 'assisted', 'live')),
  brief text,
  script text,
  call_to_action text,
  approved_at timestamptz,
  approved_by text,
  scheduled_for timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_content_jobs_lane_status
  ON public.growth_content_jobs (lane_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_growth_content_jobs_account_status
  ON public.growth_content_jobs (primary_account_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.growth_post_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_job_id uuid NOT NULL REFERENCES public.growth_content_jobs(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.growth_accounts(id) ON DELETE SET NULL,
  platform text NOT NULL
    CHECK (platform IN ('tiktok', 'youtube', 'instagram', 'x', 'linkedin')),
  variant_label text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'ready_for_review', 'approved', 'publish_requested', 'scheduled', 'published', 'failed', 'manual_post')),
  publish_url text,
  platform_post_id text,
  published_at timestamptz,
  last_attempt_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_post_targets_job_status
  ON public.growth_post_targets (content_job_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_growth_post_targets_account_status
  ON public.growth_post_targets (account_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.growth_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pod text NOT NULL
    CHECK (pod IN ('growth', 'creative', 'paid-media', 'lead-ops', 'analytics', 'ops')),
  platform text
    CHECK (platform IS NULL OR platform IN ('tiktok', 'youtube', 'instagram', 'x', 'linkedin')),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'superseded', 'archived')),
  summary text NOT NULL,
  body_markdown text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_playbooks_pod_status
  ON public.growth_playbooks (pod, status, created_at DESC);

ALTER TABLE public.growth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_content_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_post_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_playbooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "growth_accounts_read" ON public.growth_accounts;
DROP POLICY IF EXISTS "growth_accounts_insert" ON public.growth_accounts;
DROP POLICY IF EXISTS "growth_accounts_update" ON public.growth_accounts;
DROP POLICY IF EXISTS "growth_accounts_delete" ON public.growth_accounts;
DROP POLICY IF EXISTS "growth_lanes_read" ON public.growth_lanes;
DROP POLICY IF EXISTS "growth_lanes_insert" ON public.growth_lanes;
DROP POLICY IF EXISTS "growth_lanes_update" ON public.growth_lanes;
DROP POLICY IF EXISTS "growth_lanes_delete" ON public.growth_lanes;
DROP POLICY IF EXISTS "growth_ideas_read" ON public.growth_ideas;
DROP POLICY IF EXISTS "growth_ideas_insert" ON public.growth_ideas;
DROP POLICY IF EXISTS "growth_ideas_update" ON public.growth_ideas;
DROP POLICY IF EXISTS "growth_ideas_delete" ON public.growth_ideas;
DROP POLICY IF EXISTS "growth_content_jobs_read" ON public.growth_content_jobs;
DROP POLICY IF EXISTS "growth_content_jobs_insert" ON public.growth_content_jobs;
DROP POLICY IF EXISTS "growth_content_jobs_update" ON public.growth_content_jobs;
DROP POLICY IF EXISTS "growth_content_jobs_delete" ON public.growth_content_jobs;
DROP POLICY IF EXISTS "growth_post_targets_read" ON public.growth_post_targets;
DROP POLICY IF EXISTS "growth_post_targets_insert" ON public.growth_post_targets;
DROP POLICY IF EXISTS "growth_post_targets_update" ON public.growth_post_targets;
DROP POLICY IF EXISTS "growth_post_targets_delete" ON public.growth_post_targets;
DROP POLICY IF EXISTS "growth_playbooks_read" ON public.growth_playbooks;
DROP POLICY IF EXISTS "growth_playbooks_insert" ON public.growth_playbooks;
DROP POLICY IF EXISTS "growth_playbooks_update" ON public.growth_playbooks;
DROP POLICY IF EXISTS "growth_playbooks_delete" ON public.growth_playbooks;

CREATE POLICY "growth_accounts_read"
  ON public.growth_accounts
  FOR SELECT
  USING (false);

CREATE POLICY "growth_accounts_insert"
  ON public.growth_accounts
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_accounts_update"
  ON public.growth_accounts
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_accounts_delete"
  ON public.growth_accounts
  FOR DELETE
  USING (false);

CREATE POLICY "growth_lanes_read"
  ON public.growth_lanes
  FOR SELECT
  USING (false);

CREATE POLICY "growth_lanes_insert"
  ON public.growth_lanes
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_lanes_update"
  ON public.growth_lanes
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_lanes_delete"
  ON public.growth_lanes
  FOR DELETE
  USING (false);

CREATE POLICY "growth_ideas_read"
  ON public.growth_ideas
  FOR SELECT
  USING (false);

CREATE POLICY "growth_ideas_insert"
  ON public.growth_ideas
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_ideas_update"
  ON public.growth_ideas
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_ideas_delete"
  ON public.growth_ideas
  FOR DELETE
  USING (false);

CREATE POLICY "growth_content_jobs_read"
  ON public.growth_content_jobs
  FOR SELECT
  USING (false);

CREATE POLICY "growth_content_jobs_insert"
  ON public.growth_content_jobs
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_content_jobs_update"
  ON public.growth_content_jobs
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_content_jobs_delete"
  ON public.growth_content_jobs
  FOR DELETE
  USING (false);

CREATE POLICY "growth_post_targets_read"
  ON public.growth_post_targets
  FOR SELECT
  USING (false);

CREATE POLICY "growth_post_targets_insert"
  ON public.growth_post_targets
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_post_targets_update"
  ON public.growth_post_targets
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_post_targets_delete"
  ON public.growth_post_targets
  FOR DELETE
  USING (false);

CREATE POLICY "growth_playbooks_read"
  ON public.growth_playbooks
  FOR SELECT
  USING (false);

CREATE POLICY "growth_playbooks_insert"
  ON public.growth_playbooks
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "growth_playbooks_update"
  ON public.growth_playbooks
  FOR UPDATE
  USING (false);

CREATE POLICY "growth_playbooks_delete"
  ON public.growth_playbooks
  FOR DELETE
  USING (false);

DROP TRIGGER IF EXISTS growth_accounts_updated_at ON public.growth_accounts;
CREATE TRIGGER growth_accounts_updated_at
  BEFORE UPDATE ON public.growth_accounts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS growth_lanes_updated_at ON public.growth_lanes;
CREATE TRIGGER growth_lanes_updated_at
  BEFORE UPDATE ON public.growth_lanes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS growth_ideas_updated_at ON public.growth_ideas;
CREATE TRIGGER growth_ideas_updated_at
  BEFORE UPDATE ON public.growth_ideas
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS growth_content_jobs_updated_at ON public.growth_content_jobs;
CREATE TRIGGER growth_content_jobs_updated_at
  BEFORE UPDATE ON public.growth_content_jobs
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS growth_post_targets_updated_at ON public.growth_post_targets;
CREATE TRIGGER growth_post_targets_updated_at
  BEFORE UPDATE ON public.growth_post_targets
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS growth_playbooks_updated_at ON public.growth_playbooks;
CREATE TRIGGER growth_playbooks_updated_at
  BEFORE UPDATE ON public.growth_playbooks
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
