CREATE TABLE IF NOT EXISTS public.crm_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  client_slug text NOT NULL,
  content text NOT NULL,
  visibility text NOT NULL DEFAULT 'shared'
    CHECK (visibility IN ('shared', 'admin_only')),
  author_id text,
  author_name text,
  parent_comment_id uuid REFERENCES public.crm_comments(id) ON DELETE CASCADE,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_comments_contact_visibility_created
  ON public.crm_comments (contact_id, visibility, created_at);

CREATE INDEX IF NOT EXISTS idx_crm_comments_parent
  ON public.crm_comments (parent_comment_id);

ALTER TABLE public.crm_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_comments_read"
  ON public.crm_comments
  FOR SELECT
  USING (false);

CREATE POLICY "crm_comments_insert"
  ON public.crm_comments
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "crm_comments_update"
  ON public.crm_comments
  FOR UPDATE
  USING (false);

CREATE POLICY "crm_comments_delete"
  ON public.crm_comments
  FOR DELETE
  USING (false);
