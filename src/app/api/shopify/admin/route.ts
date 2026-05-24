import { NextResponse } from "next/server";
import { shopifyAdminRequest } from "@/lib/shopify-admin";
import { normalizeShopDomain } from "@/lib/shopify-oauth";
import { secretGuard } from "@/lib/api-helpers";

export const runtime = "nodejs";

const RESOURCE_PATHS = {
  orders: "/orders.json?status=any&limit=50&fields=id,name,created_at,total_price,currency,financial_status,fulfillment_status,source_name,landing_site,referring_site,line_items",
  products: "/products.json?limit=250&fields=id,title,handle,status,vendor,product_type,variants,images",
  themes: "/themes.json",
} as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secretError = secretGuard(url.searchParams.get("secret"));
  if (secretError) return secretError;

  const shop = normalizeShopDomain(url.searchParams.get("shop"));
  const resource = url.searchParams.get("resource") as keyof typeof RESOURCE_PATHS | null;
  if (!shop) return NextResponse.json({ error: "invalid_shop" }, { status: 400 });
  if (!resource || !(resource in RESOURCE_PATHS)) {
    return NextResponse.json({ error: "invalid_resource" }, { status: 400 });
  }

  try {
    const data = await shopifyAdminRequest(shop, RESOURCE_PATHS[resource]);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (caught) {
    console.error("[shopify-admin] request failed:", caught);
    return NextResponse.json({ error: "shopify_admin_failed" }, { status: 502 });
  }
}
