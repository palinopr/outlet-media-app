DROP POLICY IF EXISTS "system_events_read" ON public.system_events;

CREATE POLICY "system_events_read"
  ON public.system_events
  FOR SELECT
  USING (false);
