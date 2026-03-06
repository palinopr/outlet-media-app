CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_slug text NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  company text,
  lifecycle_stage text NOT NULL DEFAULT 'lead'
    CHECK (lifecycle_stage IN ('lead', 'qualified', 'proposal', 'customer', 'inactive')),
  visibility text NOT NULL DEFAULT 'shared'
    CHECK (visibility IN ('shared', 'admin_only')),
  source text,
  owner_name text,
  lead_score integer
    CHECK (lead_score IS NULL OR (lead_score >= 0 AND lead_score <= 100)),
  notes text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_client_stage_created_at
  ON public.crm_contacts (client_slug, lifecycle_stage, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_client_follow_up
  ON public.crm_contacts (client_slug, next_follow_up_at ASC);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_visibility_created_at
  ON public.crm_contacts (visibility, created_at DESC);

ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_contacts_read"
  ON public.crm_contacts
  FOR SELECT
  USING (false);

CREATE POLICY "crm_contacts_insert"
  ON public.crm_contacts
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "crm_contacts_update"
  ON public.crm_contacts
  FOR UPDATE
  USING (false);

CREATE POLICY "crm_contacts_delete"
  ON public.crm_contacts
  FOR DELETE
  USING (false);
