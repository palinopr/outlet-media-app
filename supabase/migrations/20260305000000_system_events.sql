CREATE TABLE IF NOT EXISTS public.system_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_name text NOT NULL,
  visibility text NOT NULL DEFAULT 'shared'
    CHECK (visibility IN ('shared', 'admin_only')),
  actor_type text NOT NULL DEFAULT 'user'
    CHECK (actor_type IN ('user', 'agent', 'system')),
  actor_id text,
  actor_name text,
  client_slug text,
  summary text NOT NULL,
  detail text,
  entity_type text,
  entity_id text,
  page_id uuid REFERENCES public.workspace_pages(id) ON DELETE SET NULL,
  task_id uuid REFERENCES public.workspace_tasks(id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_system_events_created_at
  ON public.system_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_events_client_slug_created_at
  ON public.system_events (client_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_events_event_name
  ON public.system_events (event_name);

CREATE INDEX IF NOT EXISTS idx_system_events_visibility_created_at
  ON public.system_events (visibility, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_events_page_id
  ON public.system_events (page_id);

CREATE INDEX IF NOT EXISTS idx_system_events_task_id
  ON public.system_events (task_id);

ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "system_events_read"
  ON public.system_events
  FOR SELECT
  USING (true);

CREATE POLICY "system_events_insert"
  ON public.system_events
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "system_events_update"
  ON public.system_events
  FOR UPDATE
  USING (false);

CREATE POLICY "system_events_delete"
  ON public.system_events
  FOR DELETE
  USING (false);
