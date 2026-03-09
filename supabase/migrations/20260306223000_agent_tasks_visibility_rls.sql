DROP POLICY IF EXISTS "agent_tasks_read" ON public.agent_tasks;
DROP POLICY IF EXISTS "agent_tasks_read_shared_member" ON public.agent_tasks;

CREATE POLICY "agent_tasks_read_shared_member"
  ON public.agent_tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.system_events event
      JOIN public.client_members membership
        ON membership.clerk_user_id = current_clerk_user_id()
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE event.event_name = 'agent_action_requested'
        AND event.entity_type = 'agent_task'
        AND event.entity_id = agent_tasks.id
        AND event.visibility = 'shared'
        AND event.client_slug IS NOT NULL
        AND client.slug = event.client_slug
    )
  );

CREATE INDEX IF NOT EXISTS idx_system_events_agent_task_visibility
  ON public.system_events (entity_id, client_slug, visibility)
  WHERE event_name = 'agent_action_requested' AND entity_type = 'agent_task';
