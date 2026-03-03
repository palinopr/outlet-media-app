CREATE TABLE IF NOT EXISTS public.agent_tasks (
  id                 text PRIMARY KEY DEFAULT 'task_' || substr(gen_random_uuid()::text, 1, 12),
  from_agent         text NOT NULL,
  to_agent           text NOT NULL,
  action             text NOT NULL,
  params             jsonb DEFAULT '{}',
  tier               text NOT NULL DEFAULT 'green' CHECK (tier IN ('green', 'yellow', 'red')),
  status             text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'escalated', 'approved', 'rejected', 'expired')),
  result             jsonb,
  error              text,
  approved_by        text,
  discord_message_id text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  started_at         timestamptz,
  completed_at       timestamptz
);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_to_agent_status ON public.agent_tasks (to_agent, status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status           ON public.agent_tasks (status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created          ON public.agent_tasks (created_at DESC);

ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_tasks_read"   ON public.agent_tasks FOR SELECT USING (true);
CREATE POLICY "agent_tasks_insert" ON public.agent_tasks FOR INSERT WITH CHECK (false);
CREATE POLICY "agent_tasks_update" ON public.agent_tasks FOR UPDATE USING (false);
