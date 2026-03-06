ALTER TABLE public.campaign_action_items
  ADD COLUMN IF NOT EXISTS source_entity_type text,
  ADD COLUMN IF NOT EXISTS source_entity_id text;

CREATE INDEX IF NOT EXISTS idx_campaign_action_items_source
  ON public.campaign_action_items (source_entity_type, source_entity_id);
