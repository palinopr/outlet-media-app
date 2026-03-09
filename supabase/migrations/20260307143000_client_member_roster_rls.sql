CREATE OR REPLACE FUNCTION public.is_current_client_member(target_client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.client_members membership
    WHERE membership.client_id = target_client_id
      AND membership.clerk_user_id = public.current_clerk_user_id()
  );
$$;

REVOKE ALL ON FUNCTION public.is_current_client_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_current_client_member(uuid) TO authenticated;

DROP POLICY IF EXISTS "client_members_read_self" ON public.client_members;
DROP POLICY IF EXISTS "client_members_read_client_roster" ON public.client_members;
CREATE POLICY "client_members_read_client_roster"
  ON public.client_members
  FOR SELECT
  TO authenticated
  USING (public.is_current_client_member(client_members.client_id));
