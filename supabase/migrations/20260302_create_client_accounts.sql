CREATE TABLE IF NOT EXISTS client_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL,
  client_slug text NOT NULL,
  meta_user_id text NOT NULL,
  ad_account_id text NOT NULL,
  ad_account_name text,
  access_token_encrypted text NOT NULL,
  token_expires_at timestamptz NOT NULL,
  scopes text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'revoked', 'expired')),
  connected_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_client_accounts_ad_account
  ON client_accounts (ad_account_id);

CREATE INDEX idx_client_accounts_clerk_user
  ON client_accounts (clerk_user_id);

CREATE INDEX idx_client_accounts_slug_status
  ON client_accounts (client_slug, status);
