CREATE INDEX IF NOT EXISTS idx_system_events_entity_created_at
  ON public.system_events (entity_type, entity_id, created_at DESC);
