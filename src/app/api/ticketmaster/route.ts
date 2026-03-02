import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.slice(0, 200) ?? null;

  if (!process.env.TICKETMASTER_API_KEY) {
    return NextResponse.json({ error: "TICKETMASTER_API_KEY not configured" }, { status: 500 });
  }

  const url = new URL("https://app.ticketmaster.com/discovery/v2/events");
  url.searchParams.set("apikey", process.env.TICKETMASTER_API_KEY);
  if (keyword) url.searchParams.set("keyword", keyword);
  url.searchParams.set("classificationName", "music");
  url.searchParams.set("size", "20");

  const res = await fetch(url.toString());
  const data = await res.json();

  return NextResponse.json(data);
}
