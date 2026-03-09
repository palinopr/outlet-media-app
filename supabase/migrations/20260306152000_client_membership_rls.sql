CREATE OR REPLACE FUNCTION public.current_clerk_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(auth.jwt() ->> 'sub', '');
$$;

COMMENT ON FUNCTION public.current_clerk_user_id() IS
  'Returns the current Clerk user id from the Supabase JWT sub claim.';

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_member_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_member_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clients_read_member" ON public.clients;
CREATE POLICY "clients_read_member"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.client_members membership
      WHERE membership.client_id = clients.id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "client_members_read_self" ON public.client_members;
CREATE POLICY "client_members_read_self"
  ON public.client_members
  FOR SELECT
  TO authenticated
  USING (clerk_user_id = public.current_clerk_user_id());

DROP POLICY IF EXISTS "service_role_all" ON public.client_member_campaigns;
DROP POLICY IF EXISTS "client_member_campaigns_read_self" ON public.client_member_campaigns;
CREATE POLICY "client_member_campaigns_read_self"
  ON public.client_member_campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.client_members membership
      WHERE membership.id = client_member_campaigns.member_id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "service_role_all" ON public.client_member_events;
DROP POLICY IF EXISTS "client_member_events_read_self" ON public.client_member_events;
CREATE POLICY "client_member_events_read_self"
  ON public.client_member_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.client_members membership
      WHERE membership.id = client_member_events.member_id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "system_events_read" ON public.system_events;
DROP POLICY IF EXISTS "system_events_read_shared_member" ON public.system_events;
CREATE POLICY "system_events_read_shared_member"
  ON public.system_events
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND client_slug IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = system_events.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "approval_requests_read" ON public.approval_requests;
DROP POLICY IF EXISTS "approval_requests_read_client_member" ON public.approval_requests;
CREATE POLICY "approval_requests_read_client_member"
  ON public.approval_requests
  FOR SELECT
  TO authenticated
  USING (
    audience IN ('client', 'shared')
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = approval_requests.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "campaign_action_items_read" ON public.campaign_action_items;
DROP POLICY IF EXISTS "campaign_action_items_read_shared_member" ON public.campaign_action_items;
CREATE POLICY "campaign_action_items_read_shared_member"
  ON public.campaign_action_items
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = campaign_action_items.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

-- WhatsApp remains private on purpose. It is a Discord-first internal workflow,
-- so the existing deny-all user policies stay in place until a product decision
-- explicitly asks for a user-facing WhatsApp app.
