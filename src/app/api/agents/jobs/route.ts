import { NextResponse } from "next/server";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { listAgentJobs } from "@/lib/agent-jobs";

// Returns the last 30 jobs (excluding heartbeats) for the chat panel refresh
export async function GET() {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  try {
    const jobs = await listAgentJobs(30);
    return NextResponse.json({ jobs: jobs.reverse() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return apiError(message);
  }
}
