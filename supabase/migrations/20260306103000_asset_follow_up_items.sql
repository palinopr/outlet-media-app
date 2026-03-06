CREATE TABLE IF NOT EXISTS public.asset_follow_up_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES public.ad_assets(id) ON DELETE CASCADE,
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
  source_entity_type text,
  source_entity_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_follow_up_items_asset_status_position
  ON public.asset_follow_up_items (asset_id, status, position);

CREATE INDEX IF NOT EXISTS idx_asset_follow_up_items_client_status
  ON public.asset_follow_up_items (client_slug, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_asset_follow_up_items_source
  ON public.asset_follow_up_items (source_entity_type, source_entity_id);

ALTER TABLE public.asset_follow_up_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asset_follow_up_items_read"
  ON public.asset_follow_up_items
  FOR SELECT
  USING (false);

CREATE POLICY "asset_follow_up_items_insert"
  ON public.asset_follow_up_items
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "asset_follow_up_items_update"
  ON public.asset_follow_up_items
  FOR UPDATE
  USING (false);

CREATE POLICY "asset_follow_up_items_delete"
  ON public.asset_follow_up_items
  FOR DELETE
  USING (false);
