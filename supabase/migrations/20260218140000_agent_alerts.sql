CREATE TABLE IF NOT EXISTS public.agent_alerts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message    text NOT NULL,
  level      text NOT NULL DEFAULT 'info',  -- info | warning | critical
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_alerts_created_idx ON public.agent_alerts (created_at DESC);

ALTER TABLE public.agent_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alerts_read"   ON public.agent_alerts FOR SELECT USING (true);
CREATE POLICY "alerts_insert" ON public.agent_alerts FOR INSERT WITH CHECK (false);
CREATE POLICY "alerts_update" ON public.agent_alerts FOR UPDATE USING (false);
