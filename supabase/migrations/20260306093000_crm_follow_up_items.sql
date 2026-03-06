CREATE TABLE IF NOT EXISTS public.crm_follow_up_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_crm_follow_up_items_contact_status_position
  ON public.crm_follow_up_items (contact_id, status, position);

CREATE INDEX IF NOT EXISTS idx_crm_follow_up_items_client_visibility_created_at
  ON public.crm_follow_up_items (client_slug, visibility, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_crm_follow_up_items_source
  ON public.crm_follow_up_items (source_entity_type, source_entity_id)
  WHERE source_entity_type IS NOT NULL AND source_entity_id IS NOT NULL;

ALTER TABLE public.crm_follow_up_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_follow_up_items_read"
  ON public.crm_follow_up_items
  FOR SELECT
  USING (false);

CREATE POLICY "crm_follow_up_items_insert"
  ON public.crm_follow_up_items
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "crm_follow_up_items_update"
  ON public.crm_follow_up_items
  FOR UPDATE
  USING (false);

CREATE POLICY "crm_follow_up_items_delete"
  ON public.crm_follow_up_items
  FOR DELETE
  USING (false);
