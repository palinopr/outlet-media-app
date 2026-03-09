DROP POLICY IF EXISTS "event_comments_read" ON public.event_comments;
DROP POLICY IF EXISTS "event_comments_insert" ON public.event_comments;
DROP POLICY IF EXISTS "event_comments_update" ON public.event_comments;
DROP POLICY IF EXISTS "event_comments_delete" ON public.event_comments;
DROP POLICY IF EXISTS "event_comments_read_shared_member" ON public.event_comments;
DROP POLICY IF EXISTS "event_comments_block_user_writes" ON public.event_comments;

CREATE POLICY "event_comments_read_shared_member"
  ON public.event_comments
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND EXISTS (
      SELECT 1
      FROM public.tm_events event
      JOIN public.clients client
        ON client.slug = event.client_slug
      JOIN public.client_members membership
        ON membership.client_id = client.id
      WHERE event.id = event_comments.event_id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

CREATE POLICY "event_comments_block_user_writes"
  ON public.event_comments
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "event_follow_up_items_read" ON public.event_follow_up_items;
DROP POLICY IF EXISTS "event_follow_up_items_insert" ON public.event_follow_up_items;
DROP POLICY IF EXISTS "event_follow_up_items_update" ON public.event_follow_up_items;
DROP POLICY IF EXISTS "event_follow_up_items_delete" ON public.event_follow_up_items;
DROP POLICY IF EXISTS "event_follow_up_items_read_shared_member" ON public.event_follow_up_items;
DROP POLICY IF EXISTS "event_follow_up_items_block_user_writes" ON public.event_follow_up_items;

CREATE POLICY "event_follow_up_items_read_shared_member"
  ON public.event_follow_up_items
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND EXISTS (
      SELECT 1
      FROM public.tm_events event
      JOIN public.clients client
        ON client.slug = event.client_slug
      JOIN public.client_members membership
        ON membership.client_id = client.id
      WHERE event.id = event_follow_up_items.event_id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

CREATE POLICY "event_follow_up_items_block_user_writes"
  ON public.event_follow_up_items
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);
