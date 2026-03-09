DROP POLICY IF EXISTS "client_services_all" ON public.client_services;
DROP POLICY IF EXISTS "client_services_read" ON public.client_services;
DROP POLICY IF EXISTS "client_services_read_member" ON public.client_services;
DROP POLICY IF EXISTS "client_services_block_user_writes" ON public.client_services;

CREATE POLICY "client_services_read_member"
  ON public.client_services
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.client_members membership
      WHERE membership.client_id = client_services.client_id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

CREATE POLICY "client_services_block_user_writes"
  ON public.client_services
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);
