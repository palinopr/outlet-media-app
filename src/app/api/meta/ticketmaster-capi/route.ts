import { NextResponse } from "next/server";
import {
  buildTicketmasterCapiEvent,
  getMetaCapiConfig,
  sendMetaCapiEvent,
} from "@/features/meta/conversions-api";

const transparentGif = Uint8Array.from([
  71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255, 255, 33, 249,
  4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59,
]);

function pixelResponse() {
  return new NextResponse(transparentGif, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "Content-Type": "image/gif",
      Expires: "0",
      Pragma: "no-cache",
    },
  });
}

export async function GET(request: Request) {
  const response = pixelResponse();
  const url = new URL(request.url);
  const config = getMetaCapiConfig();

  // The Ticketmaster Custom pixel URL is public by design. Require a static
  // shared key before sending server-side conversion events so random traffic
  // cannot spoof purchases. The endpoint still returns a valid 1x1 image so
  // Ticketmaster validation and browser requests do not break.
  if (!config.pixelSecret || url.searchParams.get("key") !== config.pixelSecret) {
    if (!config.pixelSecret) console.warn("[meta:capi] TICKETMASTER_CAPI_PIXEL_SECRET is not configured");
    return response;
  }

  if (!config.accessToken || !config.pixelId) {
    console.warn("[meta:capi] Meta CAPI credentials are not configured");
    return response;
  }

  const { event, skipReason } = buildTicketmasterCapiEvent(url, request.headers);
  if (!event) {
    console.warn(`[meta:capi] skipped Ticketmaster event: ${skipReason}`);
    return response;
  }

  try {
    await sendMetaCapiEvent({
      accessToken: config.accessToken,
      event,
      pixelId: config.pixelId,
      testEventCode: config.testEventCode,
    });
  } catch (error) {
    console.error("[meta:capi] failed to send Ticketmaster event", error);
  }

  return response;
}
