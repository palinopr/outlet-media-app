import { supabaseAdmin } from "@/lib/supabase";

interface RouteContext {
  params?: Promise<{
    token?: string;
  }>;
}

async function resolveToken(request: Request, context?: RouteContext): Promise<string | null> {
  const fromParams = (await context?.params)?.token?.trim();
  if (fromParams) return fromParams;

  const pathToken = new URL(request.url).pathname.split("/").filter(Boolean).at(-1)?.trim();
  return pathToken || null;
}

export async function GET(request: Request, context?: RouteContext) {
  const token = await resolveToken(request, context);
  if (!token) {
    return new Response("Not found", { status: 404 });
  }

  if (!supabaseAdmin) {
    return new Response("Service unavailable", { status: 503 });
  }

  const { data: option, error: optionError } = await supabaseAdmin
    .from("whatsapp_ticket_concierge_options")
    .select("id, map_svg, option_set_id")
    .eq("map_token", token)
    .maybeSingle();

  if (optionError) {
    return new Response("Service unavailable", { status: 503 });
  }

  if (!option) {
    return new Response("Not found", { status: 404 });
  }

  const { data: optionSet, error: optionSetError } = await supabaseAdmin
    .from("whatsapp_ticket_concierge_option_sets")
    .select("expires_at, id, status")
    .eq("id", option.option_set_id)
    .maybeSingle();

  if (optionSetError) {
    return new Response("Service unavailable", { status: 503 });
  }

  if (!optionSet || optionSet.status !== "active" || new Date(optionSet.expires_at).getTime() <= Date.now()) {
    return new Response("Unavailable", { status: 410 });
  }

  return new Response(option.map_svg, {
    headers: {
      "Cache-Control": "public, max-age=60",
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
