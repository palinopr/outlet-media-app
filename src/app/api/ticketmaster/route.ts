import { NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";

export async function GET(request: Request) {
  const { error } = await authGuard();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.slice(0, 200) ?? null;

  if (!process.env.TICKETMASTER_API_KEY) {
    return apiError("TICKETMASTER_API_KEY not configured");
  }

  const url = new URL("https://app.ticketmaster.com/discovery/v2/events");
  url.searchParams.set("apikey", process.env.TICKETMASTER_API_KEY);
  if (keyword) url.searchParams.set("keyword", keyword);
  url.searchParams.set("classificationName", "music");
  url.searchParams.set("size", "20");

  const res = await fetch(url.toString());

  if (!res.ok) {
    return apiError(`Ticketmaster API returned ${res.status}`, res.status);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return apiError("Ticketmaster API returned invalid JSON", 502);
  }

  return NextResponse.json(data);
}
