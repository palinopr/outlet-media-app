CREATE TABLE IF NOT EXISTS public.event_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.tm_events(id) ON DELETE CASCADE,
  client_slug text,
  content text NOT NULL,
  visibility text NOT NULL DEFAULT 'shared' CHECK (visibility IN ('shared', 'admin_only')),
  author_id text,
  author_name text,
  parent_comment_id uuid REFERENCES public.event_comments(id) ON DELETE CASCADE,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_event_comments_event_created
  ON public.event_comments (event_id, created_at);

CREATE INDEX IF NOT EXISTS idx_event_comments_client_created
  ON public.event_comments (client_slug, created_at DESC);

ALTER TABLE public.event_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_comments_read"
  ON public.event_comments
  FOR SELECT
  USING (true);

CREATE POLICY "event_comments_insert"
  ON public.event_comments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "event_comments_update"
  ON public.event_comments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "event_comments_delete"
  ON public.event_comments
  FOR DELETE
  USING (true);
