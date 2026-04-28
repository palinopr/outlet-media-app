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

function getApplicationErrorWindowMinutes() {
  const configured = Number(process.env.APPLICATION_ERROR_ALERT_WINDOW_MINUTES ?? "60");
  return Number.isFinite(configured) && configured > 0 ? configured : 60;
}

async function getApplicationErrorHealth() {
  const windowMinutes = getApplicationErrorWindowMinutes();
  if (!supabaseAdmin) {
    return {
      count: null,
      status: "not_configured" as const,
      windowMinutes,
    };
  }

  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();

  try {
    const { count, error } = await supabaseAdmin
      .from("application_errors")
      .select("id", { count: "exact", head: true })
      .eq("level", "error")
      .gte("created_at", since);

    if (error) {
      console.error("[health] application error check failed:", error.message);
      return { count: null, status: "error" as const, windowMinutes };
    }

    const recentCount = count ?? 0;
    return {
      count: recentCount,
      status: recentCount > 0 ? "warning" as const : "ok" as const,
      windowMinutes,
    };
  } catch (error) {
    console.error("[health] application error check failed:", error);
    return { count: null, status: "error" as const, windowMinutes };
  }
}

export async function GET() {
  const [database, applicationErrors] = await Promise.all([
    getDatabaseHealth(),
    getApplicationErrorHealth(),
  ]);

  return NextResponse.json({
    checks: {
      application_errors: applicationErrors.status,
      database,
    },
    observability: {
      recentApplicationErrors: {
        count: applicationErrors.count,
        level: "error",
        windowMinutes: applicationErrors.windowMinutes,
      },
    },
    status: database === "error" ? "degraded" : "ok",
    timestamp: new Date().toISOString(),
    version: packageJson.version,
  });
}
