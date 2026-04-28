# Google Ads API

Use this page when work touches Google Ads API auth, manager-account access, or local credential wiring.

## Local env naming rule

Do not reuse the Gmail / TM1 OAuth variables for Google Ads API auth.

Keep Google Ads API credentials in their own env namespace:

- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID`
- `GOOGLE_ADS_CUSTOMER_ID`

The older generic Google vars are already used elsewhere in the repo for Gmail-backed Ticketmaster flows:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Do not silently overwrite those with Google Ads credentials.

## OAuth setup rules

When using OAuth Playground with your own credentials:

- create a **web application** OAuth client
- allow this redirect URI exactly:
  - `https://developers.google.com/oauthplayground`

A desktop OAuth client is fine for installed-app flows, but it will fail in OAuth Playground with `redirect_uri_mismatch`.

## Cloud project rule

Enable the **Google Ads API** in the same Google Cloud project that owns the OAuth client being used for the refresh token flow.

If the OAuth client exists but the API is not enabled in that same project, Google Ads API calls fail with a service-disabled error.

## Manager-account rule

Run the API Center / developer-token flow at the manager / MCC level.

For API calls across an account hierarchy:

- use the Google login that actually has access under the manager structure
- set `GOOGLE_ADS_LOGIN_CUSTOMER_ID` to the manager account id
- set `GOOGLE_ADS_CUSTOMER_ID` to the specific account you want to query or mutate

If you are only doing first-pass connectivity checks, the manager account itself can be used as the initial customer id.

### Current Ataca Sergio target

For the Ataca Sergio Google Ads setup validated on `2026-04-08`, the working routing is:

- `GOOGLE_ADS_LOGIN_CUSTOMER_ID=7961437935`
- `GOOGLE_ADS_CUSTOMER_ID=5918084582`

That customer resolves to:
- `Zamora - Ataca Sergio`
- `USD`
- `America/New_York`

### Event ticket sales certification status

A later live policy pass on `2026-04-08` showed the account still needed:
- `Submit application to run event ticket sales ads`

The Google support form was then submitted successfully at:
- `https://support.google.com/google-ads/contact/Certification_AdWords_policy`

Submitted details:
- submitted under Google account: `jaime@outletmedia.net`
- Google Ads customer id: `591-808-4582`
- end client company name: `Zamora Live`
- agency company name: `Outlet Media`
- callback phone used: `3132916112`
- URLs used:
  - `https://zamoralive.com/`
  - `https://www.ticketmaster.com/festival-ataca-sergio-newark-new-jersey-05-30-2026/event/02006478E042F9B1`
- business model selected:
  - `Proveedor original o grupo asociado al evento cuyo sitio web redirige al de un proveedor original`

Confirmation shown after submit:
- `Se ha enviado tu correo electrónico.`
- `Gracias por ponerte en contacto con el equipo de Asistencia de Google Ads.`

Immediate post-submit policy-page read:
- `You've started an application for event ticket sales ads`
- `Once submitted, your application will be reviewed within 2 business days · ticketmaster.com`

No visible case id was shown on the confirmation screen.

## First read pattern

For the first safe live read, start with the REST `googleAds:searchStream` flow.

Practical pattern:

- refresh an access token from the saved OAuth refresh token
- query the selected account with `searchStream`
- if the selected account is a manager, read `customer` plus `customer_client`
- if the selected account is not a manager, read `customer` plus a small recent `campaign` snapshot

The repo now includes a first-pass script for this:

- `npm run google:first-read`
- optional override: `npm run google:first-read -- 1234567890`

That command reads `.env.local`, uses the dedicated Google Ads env vars, and prints a JSON snapshot.

For broader discovery under a manager tree, the repo also includes:

- `npm run google:discover`
- optional override: `npm run google:discover -- --root=3443333917`

That script recursively inspects the manager hierarchy and surfaces leaf accounts with last-30-day metrics.

A later live Ataca Sergio build also added a one-off search-campaign launcher:

- `npm run google:ataca-sergio:search`

That script is intentionally specific to the Ataca Sergio high-intent Search build and writes an execution artifact to the ads wiki outputs folder.

## New-account enablement note

A later live UI pass the same day created a new Google Ads customer for Ataca Sergio, and the UI showed a fresh customer id immediately.

But an immediate API read still failed with `authorizationError: CUSTOMER_NOT_ENABLED`.

A later billing-connected retry still returned the same error, even though a manager-level `customer_client` query already showed the child as `ENABLED`.

Practical rule:

- a newly created Google Ads account can exist in the UI before it is fully API-usable
- the manager tree can show the child as enabled before direct reads into that customer start working
- billing / signup propagation may still be incomplete even after the billing page looks healthy

So after account creation, confirm enablement with a real API read before wiring the new customer id into normal automation.

In the Ataca Sergio setup, a later retry did start working once propagation caught up. The direct child read returned:
- customer id: `5918084582`
- name: `Zamora - Ataca Sergio`
- currency: `USD`
- time zone: `America/New_York`
- manager: `false`

So the practical sequence was:
1. account visible in UI
2. billing connected
3. temporary `CUSTOMER_NOT_ENABLED`
4. later direct API read succeeds

## Explorer-access limitation

A live setup pass on `2026-04-08` confirmed a narrower constraint than expected:

- the current developer token can do read flows like `searchStream`
- the same token also succeeded on standard live mutations for an existing child account:
  - conversion action creation
  - campaign budget creation
  - campaign creation
  - ad group creation
  - keyword creation
  - responsive search ad creation
- but `Explorer Access` was **not enough** for `createCustomerClient`

A direct create-account attempt failed with:
- `authorizationError: DEVELOPER_TOKEN_NOT_APPROVED`
- message: `This method is not allowed for use with explorer access. Please apply for basic or standard access.`

So the important practical boundary from this live setup is:
- existing accessible production accounts can be read and, in this case, mutated for standard campaign-building work
- creating brand-new child accounts via API is still blocked until the token has a higher access tier

If the manager tree does not already contain a usable client account, the fallback path remains manual account creation / linking in the Google Ads UI.

## Ticketmaster conversion-tracking note

Google Ads does not use a Meta-style "pixel" term here.

For Google Ads, the comparable paths are:

- a Google tag / Google Ads conversion tag on a page you control, or
- offline conversion import using click ids like `gclid`, `gbraid`, or `wbraid`

So if final checkout happens on Ticketmaster and you cannot place a Google tag directly on that destination, the practical fallback is:

- capture the Google click id before handing the user off to Ticketmaster, and
- import conversions back into Google Ads later when order data is available

A later live ticketing-side check showed a pixel-vendor UI that explicitly offered `Google AdWords` with these tag types:

- `Global Site Tag`
- `Event Snippet`
- `Conversion (Previous)`
- `Remarketing (Previous)`

Practical reading:

- prefer the current `gtag.js` Google Ads path with `AW-...` ids
- use `Global Site Tag` as the base tag
- use `Event Snippet` for purchase / conversion pages when supported
- avoid the `Previous` legacy options unless the ticketing UI or account setup forces them

Live Ataca Sergio setup on `2026-04-08`:

- customer id: `5918084582`
- conversion action id: `7567090523`
- conversion action name: `Ataca Sergio - Ticketmaster Purchase`
- Google tag id: `AW-18074288244`
- event `send_to`: `AW-18074288244/aH3KCNvGopgcEPSAv6pD`

Important implementation note:

- Google returned multiple snippet variants, including `WEBPAGE` and `WEBPAGE_ONCLICK`
- TM1 Marketing help later clarified that Ticketmaster already has Google Tag Manager with the Conversion Linker in place
- so for TM1 Marketing, do **not** paste the full Google `Global Site Tag`
- for the Google AdWords `Event Snippet` vendor flow, TM1 expects only the `send_to` value from the Google snippet
- for the live Ataca Sergio purchase conversion, that exact value is:
  - `AW-18074288244/aH3KCNvGopgcEPSAv6pD`
- use it on the `Order Confirmation` page type for purchase tracking
- TM1 will auto-send:
  - `value` = face value total without fees
  - `currency` = order currency
  - `transaction_id` = confirmation code
- only use `WEBPAGE_ONCLICK` if the host platform specifically expects click-triggered conversion code

Saved artifact:
- `/Users/jaimeortiz/projects/meta ads manager wiki/outputs/ataca-sergio-google-ads-purchase-tag-2026-04-08.json`

TM1 Marketing install rule from the live Ataca Sergio setup:

1. choose vendor `Google AdWords`
2. choose pixel type `Event Snippet`
3. choose page type `Order Confirmation`
4. paste only the `send_to` value:
   - `AW-18074288244/aH3KCNvGopgcEPSAv6pD`
5. do not paste the full script block
6. do not paste the Global Site Tag into TM1 Marketing

The live TM1 save actually succeeded and created:
- TM1 marketing id: `158861`
- status: `Active`
- badge: `Verified`
- page type: `Confirmation Page - Primary`
- vendor/type: `Google AdWords` + `Event Snippet`
- end date used in the live save: `06/01/2026`

Operator note: the old repo-local TM1 browser automation scripts were retired with the agent runtime. If TM1 browser automation returns, reintroduce it deliberately with current docs, secrets handling, and verification.

So do not assume Ticketmaster is untaggable. First confirm whether the ticketing page type available to you supports the current Google Ads tag placement.

## Testing-mode warning

If the OAuth consent screen is still in **testing**, Google can issue a refresh token with a short lifetime instead of a durable production-style token.

So:

- a testing-mode refresh token may work for immediate setup and validation
- it should not be treated as a stable long-lived production credential

Before relying on the credential for durable automation, move the OAuth app out of testing if required by the intended workflow.
