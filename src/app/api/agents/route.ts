import { NextResponse } from "next/server";

// POST /api/agents - trigger an agent run
export async function POST(request: Request) {
  const body = await request.json() as { agent: string; payload?: unknown };
  const { agent, payload } = body;

  // TODO: wire to actual agent execution (OpenCode SDK / Claude SDK)
  console.log(`Agent triggered: ${agent}`, payload);

  return NextResponse.json({ status: "queued", agent, timestamp: new Date().toISOString() });
}

// GET /api/agents - list agent statuses
export async function GET() {
  const agents = [
    { name: "ticketmaster-scraper", status: "idle", lastRun: null },
    { name: "meta-ads-manager", status: "idle", lastRun: null },
    { name: "campaign-monitor", status: "idle", lastRun: null },
  ];
  return NextResponse.json({ agents });
}
