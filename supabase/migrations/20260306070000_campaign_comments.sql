CREATE TABLE IF NOT EXISTS public.campaign_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id text NOT NULL,
  client_slug text NOT NULL,
  content text NOT NULL,
  visibility text NOT NULL DEFAULT 'shared'
    CHECK (visibility IN ('shared', 'admin_only')),
  author_id text,
  author_name text,
  parent_comment_id uuid REFERENCES public.campaign_comments(id) ON DELETE CASCADE,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaign_comments_campaign_visibility_created
  ON public.campaign_comments (campaign_id, visibility, created_at);

CREATE INDEX IF NOT EXISTS idx_campaign_comments_parent
  ON public.campaign_comments (parent_comment_id);

ALTER TABLE public.campaign_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_comments_read"
  ON public.campaign_comments
  FOR SELECT
  USING (false);

CREATE POLICY "campaign_comments_insert"
  ON public.campaign_comments
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "campaign_comments_update"
  ON public.campaign_comments
  FOR UPDATE
  USING (false);

CREATE POLICY "campaign_comments_delete"
  ON public.campaign_comments
  FOR DELETE
  USING (false);
