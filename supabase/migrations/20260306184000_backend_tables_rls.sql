ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_dnc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_callbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calls_block_user_access" ON public.calls;
CREATE POLICY "calls_block_user_access"
  ON public.calls
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "compliance_logs_block_user_access" ON public.compliance_logs;
CREATE POLICY "compliance_logs_block_user_access"
  ON public.compliance_logs
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "conversation_checkpoints_block_user_access" ON public.conversation_checkpoints;
CREATE POLICY "conversation_checkpoints_block_user_access"
  ON public.conversation_checkpoints
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "internal_dnc_block_user_access" ON public.internal_dnc;
CREATE POLICY "internal_dnc_block_user_access"
  ON public.internal_dnc
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "leads_block_user_access" ON public.leads;
CREATE POLICY "leads_block_user_access"
  ON public.leads
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "recordings_block_user_access" ON public.recordings;
CREATE POLICY "recordings_block_user_access"
  ON public.recordings
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "scheduled_callbacks_block_user_access" ON public.scheduled_callbacks;
CREATE POLICY "scheduled_callbacks_block_user_access"
  ON public.scheduled_callbacks
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);
