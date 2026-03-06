CREATE TABLE IF NOT EXISTS public.whatsapp_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  waba_id text,
  phone_number_id text NOT NULL UNIQUE,
  display_phone_number text,
  business_display_name text,
  label text,
  default_client_slug text,
  default_discord_channel text,
  default_agent_key text NOT NULL DEFAULT 'customer-whatsapp-agent',
  mode text NOT NULL DEFAULT 'shadow'
    CHECK (mode IN ('shadow', 'draft_only', 'assisted', 'live')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_accounts_client_slug
  ON public.whatsapp_accounts (default_client_slug, created_at DESC);

CREATE TABLE IF NOT EXISTS public.whatsapp_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wa_id text NOT NULL UNIQUE,
  phone_number text,
  profile_name text,
  client_slug text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_client_slug
  ON public.whatsapp_contacts (client_slug, created_at DESC);

CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.whatsapp_accounts(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  client_slug text,
  discord_channel_name text,
  discord_thread_id text,
  agent_key text NOT NULL DEFAULT 'customer-whatsapp-agent',
  mode text NOT NULL DEFAULT 'shadow'
    CHECK (mode IN ('shadow', 'draft_only', 'assisted', 'live')),
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'paused', 'closed', 'blocked')),
  last_inbound_message_at timestamptz,
  last_outbound_message_at timestamptz,
  last_message_preview text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_conversations_account_contact_key UNIQUE (account_id, contact_id)
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_client_slug_status
  ON public.whatsapp_conversations (client_slug, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_discord_channel
  ON public.whatsapp_conversations (discord_channel_name, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES public.whatsapp_accounts(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.whatsapp_contacts(id) ON DELETE SET NULL,
  message_id text NOT NULL UNIQUE,
  direction text NOT NULL
    CHECK (direction IN ('inbound', 'outbound', 'system')),
  message_type text NOT NULL,
  status text NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'queued', 'sent', 'delivered', 'read', 'failed', 'ignored')),
  text_body text,
  from_wa_id text,
  to_wa_id text,
  context_message_id text,
  provider_conversation_id text,
  provider_pricing jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  received_at timestamptz,
  sent_at timestamptz,
  mirrored_to_discord_at timestamptz,
  triaged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_conversation_created_at
  ON public.whatsapp_messages (conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_contact_created_at
  ON public.whatsapp_messages (contact_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status_created_at
  ON public.whatsapp_messages (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_received_at
  ON public.whatsapp_messages (received_at DESC);

ALTER TABLE public.whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "whatsapp_accounts_read" ON public.whatsapp_accounts;
DROP POLICY IF EXISTS "whatsapp_accounts_insert" ON public.whatsapp_accounts;
DROP POLICY IF EXISTS "whatsapp_accounts_update" ON public.whatsapp_accounts;
DROP POLICY IF EXISTS "whatsapp_accounts_delete" ON public.whatsapp_accounts;
DROP POLICY IF EXISTS "whatsapp_contacts_read" ON public.whatsapp_contacts;
DROP POLICY IF EXISTS "whatsapp_contacts_insert" ON public.whatsapp_contacts;
DROP POLICY IF EXISTS "whatsapp_contacts_update" ON public.whatsapp_contacts;
DROP POLICY IF EXISTS "whatsapp_contacts_delete" ON public.whatsapp_contacts;
DROP POLICY IF EXISTS "whatsapp_conversations_read" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "whatsapp_conversations_insert" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "whatsapp_conversations_update" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "whatsapp_conversations_delete" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "whatsapp_messages_read" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "whatsapp_messages_insert" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "whatsapp_messages_update" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "whatsapp_messages_delete" ON public.whatsapp_messages;

CREATE POLICY "whatsapp_accounts_read"
  ON public.whatsapp_accounts
  FOR SELECT
  USING (false);

CREATE POLICY "whatsapp_accounts_insert"
  ON public.whatsapp_accounts
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "whatsapp_accounts_update"
  ON public.whatsapp_accounts
  FOR UPDATE
  USING (false);

CREATE POLICY "whatsapp_accounts_delete"
  ON public.whatsapp_accounts
  FOR DELETE
  USING (false);

CREATE POLICY "whatsapp_contacts_read"
  ON public.whatsapp_contacts
  FOR SELECT
  USING (false);

CREATE POLICY "whatsapp_contacts_insert"
  ON public.whatsapp_contacts
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "whatsapp_contacts_update"
  ON public.whatsapp_contacts
  FOR UPDATE
  USING (false);

CREATE POLICY "whatsapp_contacts_delete"
  ON public.whatsapp_contacts
  FOR DELETE
  USING (false);

CREATE POLICY "whatsapp_conversations_read"
  ON public.whatsapp_conversations
  FOR SELECT
  USING (false);

CREATE POLICY "whatsapp_conversations_insert"
  ON public.whatsapp_conversations
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "whatsapp_conversations_update"
  ON public.whatsapp_conversations
  FOR UPDATE
  USING (false);

CREATE POLICY "whatsapp_conversations_delete"
  ON public.whatsapp_conversations
  FOR DELETE
  USING (false);

CREATE POLICY "whatsapp_messages_read"
  ON public.whatsapp_messages
  FOR SELECT
  USING (false);

CREATE POLICY "whatsapp_messages_insert"
  ON public.whatsapp_messages
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "whatsapp_messages_update"
  ON public.whatsapp_messages
  FOR UPDATE
  USING (false);

CREATE POLICY "whatsapp_messages_delete"
  ON public.whatsapp_messages
  FOR DELETE
  USING (false);

DROP TRIGGER IF EXISTS whatsapp_accounts_updated_at ON public.whatsapp_accounts;
CREATE TRIGGER whatsapp_accounts_updated_at
  BEFORE UPDATE ON public.whatsapp_accounts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS whatsapp_contacts_updated_at ON public.whatsapp_contacts;
CREATE TRIGGER whatsapp_contacts_updated_at
  BEFORE UPDATE ON public.whatsapp_contacts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS whatsapp_conversations_updated_at ON public.whatsapp_conversations;
CREATE TRIGGER whatsapp_conversations_updated_at
  BEFORE UPDATE ON public.whatsapp_conversations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS whatsapp_messages_updated_at ON public.whatsapp_messages;
CREATE TRIGGER whatsapp_messages_updated_at
  BEFORE UPDATE ON public.whatsapp_messages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
