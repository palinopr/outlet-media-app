CREATE TABLE IF NOT EXISTS public.asset_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES public.ad_assets(id) ON DELETE CASCADE,
  client_slug text NOT NULL,
  content text NOT NULL,
  visibility text NOT NULL DEFAULT 'shared'
    CHECK (visibility IN ('shared', 'admin_only')),
  author_id text,
  author_name text,
  parent_comment_id uuid REFERENCES public.asset_comments(id) ON DELETE CASCADE,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_comments_asset_visibility_created
  ON public.asset_comments (asset_id, visibility, created_at);

CREATE INDEX IF NOT EXISTS idx_asset_comments_client_created
  ON public.asset_comments (client_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_asset_comments_parent
  ON public.asset_comments (parent_comment_id);

ALTER TABLE public.asset_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asset_comments_read"
  ON public.asset_comments
  FOR SELECT
  USING (false);

CREATE POLICY "asset_comments_insert"
  ON public.asset_comments
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "asset_comments_update"
  ON public.asset_comments
  FOR UPDATE
  USING (false);

CREATE POLICY "asset_comments_delete"
  ON public.asset_comments
  FOR DELETE
  USING (false);
