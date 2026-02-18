-- Daily snapshot tables for historical trend analysis
-- campaign_snapshots: one row per campaign per day (ROAS/spend trends)
-- event_snapshots: one row per TM event per day (ticket velocity)

CREATE TABLE IF NOT EXISTS public.campaign_snapshots (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id   text NOT NULL,
  spend         bigint,           -- in cents
  impressions   bigint,
  clicks        bigint,
  roas          numeric(10,4),
  cpm           numeric(10,4),
  cpc           numeric(10,4),
  ctr           numeric(10,6),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS campaign_snapshots_campaign_date_idx
  ON public.campaign_snapshots (campaign_id, snapshot_date DESC);

CREATE TABLE IF NOT EXISTS public.event_snapshots (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tm_id             text NOT NULL,
  tickets_sold      integer,
  tickets_available integer,
  gross             integer,      -- in cents
  snapshot_date     date NOT NULL DEFAULT CURRENT_DATE,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tm_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS event_snapshots_tm_date_idx
  ON public.event_snapshots (tm_id, snapshot_date DESC);

-- RLS: same pattern as parent tables — read is open, writes blocked for anon
ALTER TABLE public.campaign_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_snapshots_read" ON public.campaign_snapshots
  FOR SELECT USING (true);
CREATE POLICY "campaign_snapshots_insert" ON public.campaign_snapshots
  FOR INSERT WITH CHECK (false);

CREATE POLICY "event_snapshots_read" ON public.event_snapshots
  FOR SELECT USING (true);
CREATE POLICY "event_snapshots_insert" ON public.event_snapshots
  FOR INSERT WITH CHECK (false);
