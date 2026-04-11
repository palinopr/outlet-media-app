# Impact: src/lib/google-ads.ts

Generated from the current working tree on 2026-04-10 22:05:59.

- Category: Shared web libraries
- Impact score: 13
- Ownership: shared web library
- Feature module: none
- Route owners: none
- Imported by: src/lib/google-ads.test.ts, src/scripts/google-ads-discover-accounts.ts
- Tests related: src/lib/google-ads.test.ts
- DB objects: none
- Env vars: GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_LOGIN_CUSTOMER_ID, GOOGLE_ADS_CUSTOMER_ID
- Mutation symbols: loginCustomerId
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/lib, src / scripts
- Summary: exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION
