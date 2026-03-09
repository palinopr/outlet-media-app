ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_client_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_activity_block_user_access" ON public.admin_activity;
CREATE POLICY "admin_activity_block_user_access"
  ON public.admin_activity
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "admin_audit_log_block_user_access" ON public.admin_audit_log;
CREATE POLICY "admin_audit_log_block_user_access"
  ON public.admin_audit_log
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "campaign_client_overrides_block_user_access" ON public.campaign_client_overrides;
CREATE POLICY "campaign_client_overrides_block_user_access"
  ON public.campaign_client_overrides
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "asset_sources_block_user_access" ON public.asset_sources;
CREATE POLICY "asset_sources_block_user_access"
  ON public.asset_sources
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);
