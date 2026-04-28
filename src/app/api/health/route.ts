import { NextResponse } from "next/server";
import packageJson from "@/../package.json";
import { supabaseAdmin } from "@/lib/supabase";

async function getDatabaseHealth() {
  if (!supabaseAdmin) return "not_configured" as const;

  try {
    const { error } = await supabaseAdmin.from("clients").select("id").limit(1);
    return error ? "error" as const : "ok" as const;
  } catch (error) {
    console.error("[health] database check failed:", error);
    return "error" as const;
  }
}

export async function GET() {
  const database = await getDatabaseHealth();

  return NextResponse.json({
    checks: {
      database,
    },
    status: database === "error" ? "degraded" : "ok",
    timestamp: new Date().toISOString(),
    version: packageJson.version,
  });
}
