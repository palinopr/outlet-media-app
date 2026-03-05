import { supabaseAdmin } from "@/lib/supabase";
import type { WorkspacePage } from "@/lib/workspace-types";

export async function getClientPages(clientSlug: string): Promise<{
  pages: WorkspacePage[];
  fromDb: boolean;
}> {
  if (!supabaseAdmin) return { pages: [], fromDb: false };

  const { data, error } = await supabaseAdmin
    .from("workspace_pages")
    .select("*")
    .eq("client_slug", clientSlug)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return { pages: [], fromDb: false };

  return {
    pages: (data ?? []) as WorkspacePage[],
    fromDb: Boolean(data?.length),
  };
}

export async function getClientPage(
  pageId: string,
  clientSlug: string,
): Promise<WorkspacePage | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("workspace_pages")
    .select("*")
    .eq("id", pageId)
    .eq("client_slug", clientSlug)
    .single();

  if (error || !data) return null;

  return data as WorkspacePage;
}
