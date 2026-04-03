-- Allow client members to read their own client record
CREATE POLICY "clients_read_member"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.client_members cm
      WHERE cm.client_id = clients.id
        AND cm.clerk_user_id = public.current_clerk_user_id()
    )
  );
