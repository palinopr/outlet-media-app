import { NextResponse } from "next/server";
import { adminGuard, apiError } from "@/lib/api-helpers";
import { getAgentJob } from "@/lib/agent-jobs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;

  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!id) {
    return apiError("Invalid job ID", 400);
  }

  const job = await getAgentJob(id);
  if (!job) {
    return apiError("Job not found", 404);
  }

  return NextResponse.json({ job });
}
