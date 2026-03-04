ALTER TABLE meta_campaigns
  ADD COLUMN campaign_type TEXT DEFAULT 'sales'
  CONSTRAINT campaign_type_check CHECK (campaign_type IN ('sales', 'music', 'traffic'));
