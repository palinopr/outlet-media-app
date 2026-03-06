CREATE TABLE IF NOT EXISTS public.event_follow_up_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.tm_events(id) ON DELETE CASCADE,
  client_slug text,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  visibility text NOT NULL DEFAULT 'shared' CHECK (visibility IN ('shared', 'admin_only')),
  assignee_id text,
  assignee_name text,
  due_date date,
  created_by text,
  position integer NOT NULL DEFAULT 0,
  source_entity_type text,
  source_entity_id text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_event_follow_up_items_event_status_position
  ON public.event_follow_up_items (event_id, status, position);

CREATE INDEX IF NOT EXISTS idx_event_follow_up_items_client_status
  ON public.event_follow_up_items (client_slug, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_follow_up_items_source
  ON public.event_follow_up_items (source_entity_type, source_entity_id);

ALTER TABLE public.event_follow_up_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_follow_up_items_read"
  ON public.event_follow_up_items
  FOR SELECT
  USING (true);

CREATE POLICY "event_follow_up_items_insert"
  ON public.event_follow_up_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "event_follow_up_items_update"
  ON public.event_follow_up_items
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "event_follow_up_items_delete"
  ON public.event_follow_up_items
  FOR DELETE
  USING (true);
