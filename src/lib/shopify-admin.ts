import { decryptShopifyToken, SHOPIFY_API_VERSION } from "@/lib/shopify-oauth";
import { supabaseAdmin } from "@/lib/supabase";

export type ShopifyConnection = {
  access_token_encrypted: string;
  shop_domain: string;
};

export async function getShopifyConnection(shopDomain: string) {
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  const { data, error } = await supabaseAdmin
    .from("shopify_connections")
    .select("shop_domain,access_token_encrypted")
    .eq("shop_domain", shopDomain)
    .eq("status", "active")
    .single();

  if (error || !data) {
    throw new Error(`No active Shopify connection for ${shopDomain}`);
  }

  return data as ShopifyConnection;
}

export async function shopifyAdminRequest<T>(
  shopDomain: string,
  path: string,
  init: RequestInit = {},
) {
  const connection = await getShopifyConnection(shopDomain);
  const token = decryptShopifyToken(connection.access_token_encrypted);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}${normalizedPath}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
      ...init.headers,
    },
  });

  if (supabaseAdmin) {
    await supabaseAdmin
      .from("shopify_connections")
      .update({ last_used_at: new Date().toISOString() })
      .eq("shop_domain", shopDomain);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Admin API failed: ${response.status} ${text.slice(0, 300)}`);
  }

  return response.json() as Promise<T>;
}
