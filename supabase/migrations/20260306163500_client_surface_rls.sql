ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_read_self_member" ON public.notifications;
CREATE POLICY "notifications_read_self_member"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    user_id = public.current_clerk_user_id()
    AND (
      client_slug IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.client_members membership
        JOIN public.clients client
          ON client.id = membership.client_id
        WHERE client.slug = notifications.client_slug
          AND membership.clerk_user_id = public.current_clerk_user_id()
      )
    )
  );

DROP POLICY IF EXISTS "workspace_pages_read_client_member" ON public.workspace_pages;
CREATE POLICY "workspace_pages_read_client_member"
  ON public.workspace_pages
  FOR SELECT
  TO authenticated
  USING (
    client_slug <> 'admin'
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = workspace_pages.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "workspace_comments_read_client_member" ON public.workspace_comments;
CREATE POLICY "workspace_comments_read_client_member"
  ON public.workspace_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.workspace_pages page
      JOIN public.client_members membership
        ON membership.clerk_user_id = public.current_clerk_user_id()
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE page.id = workspace_comments.page_id
        AND page.client_slug <> 'admin'
        AND client.slug = page.client_slug
    )
  );

DROP POLICY IF EXISTS "workspace_tasks_read_client_member" ON public.workspace_tasks;
CREATE POLICY "workspace_tasks_read_client_member"
  ON public.workspace_tasks
  FOR SELECT
  TO authenticated
  USING (
    client_slug <> 'admin'
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = workspace_tasks.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "ad_assets_read_client_member" ON public.ad_assets;
CREATE POLICY "ad_assets_read_client_member"
  ON public.ad_assets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE client.slug = ad_assets.client_slug
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

DROP POLICY IF EXISTS "client_accounts_block_user_access" ON public.client_accounts;
CREATE POLICY "client_accounts_block_user_access"
  ON public.client_accounts
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

COMMENT ON POLICY "client_accounts_block_user_access" ON public.client_accounts IS
  'OAuth token rows stay server-only; user-facing reads should go through safe server projections.';
