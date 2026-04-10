export const SHOPIFY_ADMIN_DEFAULT_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-04";

export interface ShopifyAdminCredentials {
  storeDomain: string;
  accessToken: string;
  apiVersion: string;
}

export interface ShopifyFirstReadSnapshot {
  apiVersion: string;
  shop: {
    name: string | null;
    myshopifyDomain: string | null;
    primaryDomainUrl: string | null;
  };
  accessScopes: string[];
  recentProducts: Array<{
    id: string;
    title: string | null;
    handle: string | null;
    status: string | null;
    totalInventory: number | null;
    updatedAt: string | null;
  }>;
  recentOrders: Array<{
    id: string;
    name: string | null;
    createdAt: string | null;
    displayFinancialStatus: string | null;
    displayFulfillmentStatus: string | null;
    totalAmount: string | null;
    currencyCode: string | null;
  }>;
  locations: Array<{
    id: string;
    name: string | null;
    isActive: boolean | null;
  }>;
}

interface ShopifyGraphqlEnvelope<T> {
  data?: T;
  errors?: unknown;
}

interface ShopifyFirstReadQueryResult {
  shop?: {
    name?: string | null;
    myshopifyDomain?: string | null;
    primaryDomain?: {
      url?: string | null;
    } | null;
  } | null;
  currentAppInstallation?: {
    accessScopes?: Array<{
      handle?: string | null;
    }> | null;
  } | null;
  products?: {
    nodes?: Array<{
      id?: string | null;
      title?: string | null;
      handle?: string | null;
      status?: string | null;
      totalInventory?: number | null;
      updatedAt?: string | null;
    }> | null;
  } | null;
  orders?: {
    nodes?: Array<{
      id?: string | null;
      name?: string | null;
      createdAt?: string | null;
      displayFinancialStatus?: string | null;
      displayFulfillmentStatus?: string | null;
      currentTotalPriceSet?: {
        shopMoney?: {
          amount?: string | null;
          currencyCode?: string | null;
        } | null;
      } | null;
    }> | null;
  } | null;
  locations?: {
    nodes?: Array<{
      id?: string | null;
      name?: string | null;
      isActive?: boolean | null;
    }> | null;
  } | null;
}

export class ShopifyAdminApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ShopifyAdminApiError";
    this.status = status;
    this.body = body;
  }
}

export function getShopifyAdminCredentials(
  overrides: Partial<ShopifyAdminCredentials> = {},
): ShopifyAdminCredentials {
  const storeDomain =
    overrides.storeDomain ?? process.env.SHOPIFY_STORE_DOMAIN ?? "";
  const accessToken =
    overrides.accessToken ?? process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ?? "";
  const apiVersion =
    overrides.apiVersion ??
    process.env.SHOPIFY_ADMIN_API_VERSION ??
    SHOPIFY_ADMIN_DEFAULT_API_VERSION;

  const missing = [
    ["SHOPIFY_STORE_DOMAIN", storeDomain],
    ["SHOPIFY_ADMIN_ACCESS_TOKEN", accessToken],
    ["SHOPIFY_ADMIN_API_VERSION", apiVersion],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Shopify configuration: ${missing.join(", ")}`);
  }

  return {
    storeDomain,
    accessToken,
    apiVersion,
  };
}

export async function shopifyAdminGraphql<T>(params: {
  query: string;
  variables?: Record<string, unknown>;
  credentials?: Partial<ShopifyAdminCredentials>;
}): Promise<T> {
  const credentials = getShopifyAdminCredentials(params.credentials);
  const response = await fetch(
    `https://${credentials.storeDomain}/admin/api/${credentials.apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": credentials.accessToken,
      },
      body: JSON.stringify({
        query: params.query,
        variables: params.variables ?? {},
      }),
    },
  );

  const body = (await response.json().catch(() => ({}))) as ShopifyGraphqlEnvelope<T>;

  if (!response.ok || body.errors) {
    throw new ShopifyAdminApiError(
      `Shopify Admin GraphQL request failed with status ${response.status}`,
      response.status,
      body,
    );
  }

  if (!body.data) {
    throw new ShopifyAdminApiError(
      "Shopify Admin GraphQL response missing data",
      response.status,
      body,
    );
  }

  return body.data;
}

export async function fetchShopifyFirstReadSnapshot(
  overrides: Partial<ShopifyAdminCredentials> = {},
): Promise<ShopifyFirstReadSnapshot> {
  const credentials = getShopifyAdminCredentials(overrides);
  const data = await shopifyAdminGraphql<ShopifyFirstReadQueryResult>({
    credentials,
    query: `#graphql
      query ShopifyFirstRead {
        shop {
          name
          myshopifyDomain
          primaryDomain {
            url
          }
        }
        currentAppInstallation {
          accessScopes {
            handle
          }
        }
        products(first: 5, sortKey: UPDATED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            status
            totalInventory
            updatedAt
          }
        }
        orders(first: 5, sortKey: CREATED_AT, reverse: true) {
          nodes {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            currentTotalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
        locations(first: 5) {
          nodes {
            id
            name
            isActive
          }
        }
      }
    `,
  });

  return {
    apiVersion: credentials.apiVersion,
    shop: {
      name: data.shop?.name ?? null,
      myshopifyDomain: data.shop?.myshopifyDomain ?? null,
      primaryDomainUrl: data.shop?.primaryDomain?.url ?? null,
    },
    accessScopes: (data.currentAppInstallation?.accessScopes ?? [])
      .map((scope) => scope?.handle ?? null)
      .filter((scope): scope is string => Boolean(scope)),
    recentProducts: (data.products?.nodes ?? []).map((product) => ({
      id: product?.id ?? "",
      title: product?.title ?? null,
      handle: product?.handle ?? null,
      status: product?.status ?? null,
      totalInventory: product?.totalInventory ?? null,
      updatedAt: product?.updatedAt ?? null,
    })),
    recentOrders: (data.orders?.nodes ?? []).map((order) => ({
      id: order?.id ?? "",
      name: order?.name ?? null,
      createdAt: order?.createdAt ?? null,
      displayFinancialStatus: order?.displayFinancialStatus ?? null,
      displayFulfillmentStatus: order?.displayFulfillmentStatus ?? null,
      totalAmount: order?.currentTotalPriceSet?.shopMoney?.amount ?? null,
      currencyCode: order?.currentTotalPriceSet?.shopMoney?.currencyCode ?? null,
    })),
    locations: (data.locations?.nodes ?? []).map((location) => ({
      id: location?.id ?? "",
      name: location?.name ?? null,
      isActive: location?.isActive ?? null,
    })),
  };
}
