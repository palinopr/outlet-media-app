# Shopify Merch Sync

Use this when Outlet needs to connect a client's existing Shopify store into the same reporting and audience system as tickets and ads.

## Core rule

If Shopify already exists, do not treat merch as a greenfield storefront problem.
Treat it as a data-connection and audience-activation problem.

## First-pass connection shape

Start with a Shopify custom app and read-only sync.

Important permission rule:

- Shopify admin access alone is not enough
- the store user also needs access to the Development Apps / custom app area in admin
- if `settings/apps/development` is blocked, the custom app cannot be created yet even if the store admin itself is visible

Important auth distinction confirmed during the Vaqueros setup:

- a Dev Dashboard app gives a `client_id` and `client_secret`, but Admin API tokens are then generated through OAuth
- an old-style admin-created custom app inside Shopify admin can issue a direct Admin API access token in that admin flow
- so if the goal is **immediate direct write access**, confirm whether the team wants:
  - Dev Dashboard app + OAuth implementation, or
  - legacy/admin custom app style token generation
- the Dev Dashboard OAuth flow can be completed against a stable public redirect route on the Outlet domain, then the resulting Admin API token can be stored locally for server use
- Shopify can still withhold optional scopes like `read_all_orders`; even after re-auth, older-than-60-day order access is not available until that permission is actually granted

Document variable names only:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`
- `SHOPIFY_WEBHOOK_SECRET`
- `SHOPIFY_ADMIN_API_VERSION`

## Minimum data to mirror

- products
- variants
- collections
- customers
- orders
- order line items
- fulfillment / cancellation state
- webhook events

## Why this matters

Once Shopify data is mirrored locally, Outlet can join:

- ticket buyers
- merch buyers
- ad audiences

That creates segments like:

- ticket buyer, no merch yet
- merch buyer, no ticket yet
- both ticket + merch buyer
- repeat merch buyer

## Recommended webhook set

- order created / paid / cancelled / fulfilled
- customer created / updated
- product created / updated / deleted
- app uninstalled

## Activation rule

The first useful commercial move is usually:

1. ticket buyers -> merch cross-sell
2. merch buyers -> next ticket push
3. warm retargeting from store visitors and buyers

## Guardrail

Do not request broad write scopes first unless the client explicitly wants Outlet to mutate store state.
If the goal is reporting and audience joins, start read-only.
If the goal is real operator control, ask for the exact write scopes needed for products, inventory, discounts, customers, orders, fulfillment, content, pages, files, or metaobjects.

Vaqueros live scope request example:

- products
- customers
- orders
- inventory
- fulfillments
- discounts
- files
- pages / content
- metaobjects

Vaqueros live result snapshot:

- Dev Dashboard app: `Outlet Ops`
- OAuth token successfully minted and stored locally
- granted write-capable access covers the requested products / customers / orders / inventory / fulfillments / discounts / files / pages-content / metaobjects set
- `read_all_orders` remained ungranted, so historical orders beyond the default 60-day window are still not available yet
- reusable verification command: `npm run shopify:first-read`
