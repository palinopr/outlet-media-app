CREATE TABLE IF NOT EXISTS public.campaign_action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id text NOT NULL,
  client_slug text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority text NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  visibility text NOT NULL DEFAULT 'shared'
    CHECK (visibility IN ('shared', 'admin_only')),
  assignee_id text,
  assignee_name text,
  due_date date,
  created_by text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaign_action_items_campaign_status_position
  ON public.campaign_action_items (campaign_id, status, position);

CREATE INDEX IF NOT EXISTS idx_campaign_action_items_client_visibility
  ON public.campaign_action_items (client_slug, visibility, created_at DESC);

ALTER TABLE public.campaign_action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_action_items_read"
  ON public.campaign_action_items
  FOR SELECT
  USING (false);

CREATE POLICY "campaign_action_items_insert"
  ON public.campaign_action_items
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "campaign_action_items_update"
  ON public.campaign_action_items
  FOR UPDATE
  USING (false);

CREATE POLICY "campaign_action_items_delete"
  ON public.campaign_action_items
  FOR DELETE
  USING (false);
