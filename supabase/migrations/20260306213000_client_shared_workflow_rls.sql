DROP POLICY IF EXISTS "crm_contacts_read" ON public.crm_contacts;
DROP POLICY IF EXISTS "crm_contacts_read_shared_member" ON public.crm_contacts;
CREATE POLICY "crm_contacts_read_shared_member"
  ON public.crm_contacts
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = crm_contacts.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "crm_comments_read" ON public.crm_comments;
DROP POLICY IF EXISTS "crm_comments_read_shared_member" ON public.crm_comments;
CREATE POLICY "crm_comments_read_shared_member"
  ON public.crm_comments
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND EXISTS (
      SELECT 1
      FROM public.crm_contacts contact
      JOIN public.client_members membership
        ON membership.clerk_user_id = public.current_clerk_user_id()
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE contact.id = crm_comments.contact_id
        AND contact.visibility = 'shared'
        AND client.slug = contact.client_slug
    )
  );

DROP POLICY IF EXISTS "crm_follow_up_items_read" ON public.crm_follow_up_items;
DROP POLICY IF EXISTS "crm_follow_up_items_read_shared_member" ON public.crm_follow_up_items;
CREATE POLICY "crm_follow_up_items_read_shared_member"
  ON public.crm_follow_up_items
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND EXISTS (
      SELECT 1
      FROM public.crm_contacts contact
      JOIN public.client_members membership
        ON membership.clerk_user_id = public.current_clerk_user_id()
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE contact.id = crm_follow_up_items.contact_id
        AND contact.visibility = 'shared'
        AND client.slug = contact.client_slug
    )
  );

DROP POLICY IF EXISTS "asset_comments_read" ON public.asset_comments;
DROP POLICY IF EXISTS "asset_comments_read_shared_member" ON public.asset_comments;
CREATE POLICY "asset_comments_read_shared_member"
  ON public.asset_comments
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND EXISTS (
      SELECT 1
      FROM public.ad_assets asset
      JOIN public.client_members membership
        ON membership.clerk_user_id = public.current_clerk_user_id()
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE asset.id = asset_comments.asset_id
        AND client.slug = asset.client_slug
    )
  );

DROP POLICY IF EXISTS "asset_follow_up_items_read" ON public.asset_follow_up_items;
DROP POLICY IF EXISTS "asset_follow_up_items_read_shared_member" ON public.asset_follow_up_items;
CREATE POLICY "asset_follow_up_items_read_shared_member"
  ON public.asset_follow_up_items
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND EXISTS (
      SELECT 1
      FROM public.ad_assets asset
      JOIN public.client_members membership
        ON membership.clerk_user_id = public.current_clerk_user_id()
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE asset.id = asset_follow_up_items.asset_id
        AND client.slug = asset.client_slug
    )
  );
