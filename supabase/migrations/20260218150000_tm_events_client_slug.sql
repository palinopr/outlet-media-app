-- Add client_slug to tm_events so events can be filtered per client portal
ALTER TABLE tm_events
  ADD COLUMN IF NOT EXISTS client_slug TEXT;

-- Index for client portal queries
CREATE INDEX IF NOT EXISTS idx_tm_events_client_slug ON tm_events(client_slug);
