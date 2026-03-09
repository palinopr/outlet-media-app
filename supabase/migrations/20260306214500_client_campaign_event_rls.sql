DROP POLICY IF EXISTS "events_read" ON public.tm_events;
DROP POLICY IF EXISTS "tm_events_read_client_member" ON public.tm_events;
CREATE POLICY "tm_events_read_client_member"
  ON public.tm_events
  FOR SELECT
  TO authenticated
  USING (
    client_slug IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = tm_events.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "campaigns_read" ON public.meta_campaigns;
DROP POLICY IF EXISTS "meta_campaigns_read_client_member" ON public.meta_campaigns;
CREATE POLICY "meta_campaigns_read_client_member"
  ON public.meta_campaigns
  FOR SELECT
  TO authenticated
  USING (
    client_slug IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = meta_campaigns.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );
