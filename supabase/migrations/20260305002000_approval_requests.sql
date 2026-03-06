CREATE TABLE IF NOT EXISTS public.approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  client_slug text NOT NULL,
  audience text NOT NULL DEFAULT 'shared'
    CHECK (audience IN ('admin', 'client', 'shared')),
  request_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  title text NOT NULL,
  summary text,
  entity_type text,
  entity_id text,
  page_id uuid REFERENCES public.workspace_pages(id) ON DELETE SET NULL,
  task_id uuid REFERENCES public.workspace_tasks(id) ON DELETE SET NULL,
  requested_by_id text,
  requested_by_name text,
  decided_by_id text,
  decided_by_name text,
  decided_at timestamptz,
  decision_note text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_approval_requests_client_slug_created_at
  ON public.approval_requests (client_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_approval_requests_status_created_at
  ON public.approval_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_approval_requests_audience_status
  ON public.approval_requests (audience, status);

CREATE INDEX IF NOT EXISTS idx_approval_requests_entity
  ON public.approval_requests (entity_type, entity_id);

ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approval_requests_read"
  ON public.approval_requests
  FOR SELECT
  USING (false);

CREATE POLICY "approval_requests_insert"
  ON public.approval_requests
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "approval_requests_update"
  ON public.approval_requests
  FOR UPDATE
  USING (false);

CREATE POLICY "approval_requests_delete"
  ON public.approval_requests
  FOR DELETE
  USING (false);
