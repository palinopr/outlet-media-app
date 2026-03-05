import { supabaseAdmin } from "@/lib/supabase";
import type { WorkspacePage } from "@/lib/workspace-types";

export async function getPages(clientSlug?: string): Promise<{
  pages: WorkspacePage[];
  fromDb: boolean;
}> {
  if (!supabaseAdmin) return { pages: [], fromDb: false };

  let query = supabaseAdmin
    .from("workspace_pages")
    .select("id, title, icon, parent_page_id, client_slug, created_by, is_archived, position, created_at, updated_at")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (clientSlug) {
    query = query.eq("client_slug", clientSlug);
  }

  const { data, error } = await query;

  if (error) return { pages: [], fromDb: false };

  return {
    pages: (data ?? []) as WorkspacePage[],
    fromDb: Boolean(data?.length),
  };
}

export async function getPage(pageId: string): Promise<WorkspacePage | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("workspace_pages")
    .select("*")
    .eq("id", pageId)
    .single();

  if (error || !data) return null;

  return data as WorkspacePage;
}
