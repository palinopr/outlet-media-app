DROP POLICY IF EXISTS "meta_campaigns_read_client_member" ON public.meta_campaigns;
CREATE POLICY "meta_campaigns_read_client_member"
  ON public.meta_campaigns
  FOR SELECT
  TO authenticated
  USING (
    public.effective_campaign_client_slug(meta_campaigns.campaign_id) IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE membership.clerk_user_id = public.current_clerk_user_id()
        AND client.slug = public.effective_campaign_client_slug(meta_campaigns.campaign_id)
    )
  );

DROP POLICY IF EXISTS "campaign_action_items_read_shared_member" ON public.campaign_action_items;
CREATE POLICY "campaign_action_items_read_shared_member"
  ON public.campaign_action_items
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND public.effective_campaign_client_slug(campaign_action_items.campaign_id) IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE membership.clerk_user_id = public.current_clerk_user_id()
        AND client.slug = public.effective_campaign_client_slug(campaign_action_items.campaign_id)
    )
  );
