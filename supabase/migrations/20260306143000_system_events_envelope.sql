ALTER TABLE public.system_events
  ADD COLUMN IF NOT EXISTS event_version integer,
  ADD COLUMN IF NOT EXISTS occurred_at timestamptz,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS correlation_id text,
  ADD COLUMN IF NOT EXISTS causation_id text,
  ADD COLUMN IF NOT EXISTS idempotency_key text;

UPDATE public.system_events
SET event_version = COALESCE(event_version, 1),
    occurred_at = COALESCE(occurred_at, created_at),
    source = COALESCE(source, 'app')
WHERE event_version IS NULL
   OR occurred_at IS NULL
   OR source IS NULL;

ALTER TABLE public.system_events
  ALTER COLUMN event_version SET DEFAULT 1,
  ALTER COLUMN event_version SET NOT NULL,
  ALTER COLUMN occurred_at SET DEFAULT now(),
  ALTER COLUMN occurred_at SET NOT NULL,
  ALTER COLUMN source SET DEFAULT 'app',
  ALTER COLUMN source SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'system_events_event_version_positive'
  ) THEN
    ALTER TABLE public.system_events
      ADD CONSTRAINT system_events_event_version_positive
      CHECK (event_version > 0);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_system_events_occurred_at
  ON public.system_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_events_correlation_id
  ON public.system_events (correlation_id)
  WHERE correlation_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_system_events_causation_id
  ON public.system_events (causation_id)
  WHERE causation_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_system_events_source_idempotency_key
  ON public.system_events (source, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

COMMENT ON COLUMN public.system_events.event_version IS
  'Event schema version for replay-safe consumers.';

COMMENT ON COLUMN public.system_events.occurred_at IS
  'Business time for when the event happened, distinct from row creation time.';

COMMENT ON COLUMN public.system_events.source IS
  'Event producer, such as app, worker, webhook, or backfill.';

COMMENT ON COLUMN public.system_events.correlation_id IS
  'Shared trace identifier across a multi-step workflow.';

COMMENT ON COLUMN public.system_events.causation_id IS
  'Identifier of the triggering event or task that caused this event.';

COMMENT ON COLUMN public.system_events.idempotency_key IS
  'Optional dedupe key for retry-safe producers and consumers.';
