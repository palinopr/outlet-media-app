CREATE TABLE IF NOT EXISTS public.email_events (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id          text NOT NULL UNIQUE,
  thread_id           text NOT NULL,
  direction           text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  sender_email        text,
  sender_name         text,
  recipient_emails    jsonb NOT NULL DEFAULT '[]'::jsonb,
  cc_emails           jsonb NOT NULL DEFAULT '[]'::jsonb,
  subject             text,
  snippet             text,
  body_text           text,
  received_at         timestamptz,
  gmail_label_ids     jsonb NOT NULL DEFAULT '[]'::jsonb,
  applied_labels      jsonb NOT NULL DEFAULT '[]'::jsonb,
  classification      text,
  importance          text,
  client_slug         text,
  contact_email       text,
  status              text NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'triaged', 'drafted', 'sent', 'ignored', 'archived')),
  needs_reply         boolean NOT NULL DEFAULT false,
  should_notify       boolean NOT NULL DEFAULT false,
  should_archive      boolean NOT NULL DEFAULT false,
  thread_summary      text,
  business_context    jsonb NOT NULL DEFAULT '{}'::jsonb,
  activity_context    jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_events_thread_id
  ON public.email_events (thread_id);

CREATE INDEX IF NOT EXISTS idx_email_events_direction_received
  ON public.email_events (direction, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_events_contact
  ON public.email_events (contact_email, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_events_client_slug
  ON public.email_events (client_slug, received_at DESC);

CREATE TABLE IF NOT EXISTS public.email_drafts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id          text REFERENCES public.email_events(message_id) ON DELETE CASCADE,
  thread_id           text NOT NULL,
  status              text NOT NULL DEFAULT 'suggested'
    CHECK (status IN ('suggested', 'approved', 'sent', 'discarded')),
  to_emails           jsonb NOT NULL DEFAULT '[]'::jsonb,
  cc_emails           jsonb NOT NULL DEFAULT '[]'::jsonb,
  subject             text,
  body_text           text NOT NULL,
  rationale           text,
  language            text,
  confidence          text,
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
  sent_message_id     text,
  sent_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_drafts_thread_id
  ON public.email_drafts (thread_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_drafts_message_id
  ON public.email_drafts (message_id);

CREATE TABLE IF NOT EXISTS public.email_reply_examples (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id          text NOT NULL UNIQUE,
  thread_id           text NOT NULL,
  contact_email       text,
  client_slug         text,
  language            text,
  topic               text,
  subject             text,
  body_text           text NOT NULL,
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_reply_examples_contact
  ON public.email_reply_examples (contact_email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_reply_examples_client
  ON public.email_reply_examples (client_slug, created_at DESC);

ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_reply_examples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "email_events_read" ON public.email_events;
DROP POLICY IF EXISTS "email_events_insert" ON public.email_events;
DROP POLICY IF EXISTS "email_events_update" ON public.email_events;
DROP POLICY IF EXISTS "email_drafts_read" ON public.email_drafts;
DROP POLICY IF EXISTS "email_drafts_insert" ON public.email_drafts;
DROP POLICY IF EXISTS "email_drafts_update" ON public.email_drafts;
DROP POLICY IF EXISTS "email_reply_examples_read" ON public.email_reply_examples;
DROP POLICY IF EXISTS "email_reply_examples_insert" ON public.email_reply_examples;
DROP POLICY IF EXISTS "email_reply_examples_update" ON public.email_reply_examples;

CREATE POLICY "email_events_read"
  ON public.email_events
  FOR SELECT
  USING (false);

CREATE POLICY "email_events_insert"
  ON public.email_events
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "email_events_update"
  ON public.email_events
  FOR UPDATE
  USING (false);

CREATE POLICY "email_drafts_read"
  ON public.email_drafts
  FOR SELECT
  USING (false);

CREATE POLICY "email_drafts_insert"
  ON public.email_drafts
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "email_drafts_update"
  ON public.email_drafts
  FOR UPDATE
  USING (false);

CREATE POLICY "email_reply_examples_read"
  ON public.email_reply_examples
  FOR SELECT
  USING (false);

CREATE POLICY "email_reply_examples_insert"
  ON public.email_reply_examples
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "email_reply_examples_update"
  ON public.email_reply_examples
  FOR UPDATE
  USING (false);
