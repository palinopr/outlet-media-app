DROP POLICY IF EXISTS "email_events_read" ON public.email_events;
DROP POLICY IF EXISTS "email_drafts_read" ON public.email_drafts;
DROP POLICY IF EXISTS "email_reply_examples_read" ON public.email_reply_examples;

CREATE POLICY "email_events_read"
  ON public.email_events
  FOR SELECT
  USING (false);

CREATE POLICY "email_drafts_read"
  ON public.email_drafts
  FOR SELECT
  USING (false);

CREATE POLICY "email_reply_examples_read"
  ON public.email_reply_examples
  FOR SELECT
  USING (false);
