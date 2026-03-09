DROP POLICY IF EXISTS "contact_submissions_block_user_access" ON public.contact_submissions;
CREATE POLICY "contact_submissions_block_user_access"
  ON public.contact_submissions
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);
