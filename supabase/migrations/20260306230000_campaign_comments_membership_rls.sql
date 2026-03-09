CREATE OR REPLACE FUNCTION public.effective_campaign_client_slug(input_campaign_id text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH campaign AS (
    SELECT campaign_id, client_slug, name
    FROM public.meta_campaigns
    WHERE campaign_id = input_campaign_id
    LIMIT 1
  ),
  campaign_override AS (
    SELECT client_slug
    FROM public.campaign_client_overrides
    WHERE campaign_id = input_campaign_id
    LIMIT 1
  )
  SELECT COALESCE(
    (
      SELECT client_slug
      FROM campaign_override
      WHERE client_slug IS NOT NULL AND client_slug <> ''
    ),
    (
      SELECT client_slug
      FROM campaign
      WHERE client_slug IS NOT NULL AND client_slug <> ''
    ),
    (
      SELECT CASE
        WHEN lower(coalesce(name, '')) LIKE '%arjona%'
          OR lower(coalesce(name, '')) LIKE '%alofoke%'
          OR lower(coalesce(name, '')) LIKE '%camila%'
          THEN 'zamora'
        WHEN lower(coalesce(name, '')) LIKE '%kybba%' THEN 'kybba'
        WHEN lower(coalesce(name, '')) LIKE '%beamina%' THEN 'beamina'
        WHEN lower(coalesce(name, '')) LIKE '%happy paws%'
          OR lower(coalesce(name, '')) LIKE '%happy_paws%'
          THEN 'happy_paws'
        ELSE NULL
      END
      FROM campaign
    )
  );
$$;

REVOKE ALL ON FUNCTION public.effective_campaign_client_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.effective_campaign_client_slug(text) TO authenticated;

CREATE INDEX IF NOT EXISTS idx_campaign_client_overrides_campaign_id
  ON public.campaign_client_overrides (campaign_id);

DROP POLICY IF EXISTS "campaign_comments_read" ON public.campaign_comments;
DROP POLICY IF EXISTS "campaign_comments_read_shared_member" ON public.campaign_comments;
CREATE POLICY "campaign_comments_read_shared_member"
  ON public.campaign_comments
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'shared'
    AND public.effective_campaign_client_slug(campaign_comments.campaign_id) IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.client_members membership
      JOIN public.clients client
        ON client.id = membership.client_id
      WHERE membership.clerk_user_id = public.current_clerk_user_id()
        AND client.slug = public.effective_campaign_client_slug(campaign_comments.campaign_id)
    )
  );
