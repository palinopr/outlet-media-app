CREATE TABLE IF NOT EXISTS public.agent_runtime_state (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_runtime_state_updated_at
  ON public.agent_runtime_state (updated_at DESC);

ALTER TABLE public.agent_runtime_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "agent_runtime_state_read" ON public.agent_runtime_state;
DROP POLICY IF EXISTS "agent_runtime_state_insert" ON public.agent_runtime_state;
DROP POLICY IF EXISTS "agent_runtime_state_update" ON public.agent_runtime_state;

CREATE POLICY "agent_runtime_state_read"
  ON public.agent_runtime_state
  FOR SELECT
  USING (true);

CREATE POLICY "agent_runtime_state_insert"
  ON public.agent_runtime_state
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "agent_runtime_state_update"
  ON public.agent_runtime_state
  FOR UPDATE
  USING (false);
