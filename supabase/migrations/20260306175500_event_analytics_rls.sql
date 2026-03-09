ALTER TABLE public.tm_event_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "event_snapshots_read" ON public.event_snapshots;
DROP POLICY IF EXISTS "event_snapshots_insert" ON public.event_snapshots;
DROP POLICY IF EXISTS "event_snapshots_read_member" ON public.event_snapshots;
DROP POLICY IF EXISTS "event_snapshots_block_user_writes" ON public.event_snapshots;

CREATE POLICY "event_snapshots_read_member"
  ON public.event_snapshots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tm_events event
      JOIN public.clients client
        ON client.slug = event.client_slug
      JOIN public.client_members membership
        ON membership.client_id = client.id
      WHERE event.tm_id = event_snapshots.tm_id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

CREATE POLICY "event_snapshots_block_user_writes"
  ON public.event_snapshots
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Service role full access" ON public.tm_event_demographics;
DROP POLICY IF EXISTS "tm_event_demographics_read_member" ON public.tm_event_demographics;
DROP POLICY IF EXISTS "tm_event_demographics_block_user_writes" ON public.tm_event_demographics;

CREATE POLICY "tm_event_demographics_read_member"
  ON public.tm_event_demographics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tm_events event
      JOIN public.clients client
        ON client.slug = event.client_slug
      JOIN public.client_members membership
        ON membership.client_id = client.id
      WHERE event.tm_id = tm_event_demographics.tm_id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

CREATE POLICY "tm_event_demographics_block_user_writes"
  ON public.tm_event_demographics
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "tm_event_daily_read_member" ON public.tm_event_daily;
DROP POLICY IF EXISTS "tm_event_daily_block_user_writes" ON public.tm_event_daily;

CREATE POLICY "tm_event_daily_read_member"
  ON public.tm_event_daily
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tm_events event
      JOIN public.clients client
        ON client.slug = event.client_slug
      JOIN public.client_members membership
        ON membership.client_id = client.id
      WHERE event.tm_id = tm_event_daily.tm_id
        AND membership.clerk_user_id = public.current_clerk_user_id()
    )
  );

CREATE POLICY "tm_event_daily_block_user_writes"
  ON public.tm_event_daily
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);
