import { supabaseAdmin } from "@/lib/supabase";
import type { WorkspacePage, WorkspaceTask } from "@/lib/workspace-types";

export async function getWorkspacePages(clientSlug?: string): Promise<{
  pages: WorkspacePage[];
  fromDb: boolean;
}> {
  if (!supabaseAdmin) return { pages: [], fromDb: false };

  let query = supabaseAdmin
    .from("workspace_pages")
    .select(
      "id, title, icon, parent_page_id, client_slug, created_by, is_archived, position, created_at, updated_at",
    )
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

export async function getWorkspacePage(
  pageId: string,
  clientSlug?: string,
): Promise<WorkspacePage | null> {
  if (!supabaseAdmin) return null;

  let query = supabaseAdmin
    .from("workspace_pages")
    .select("*")
    .eq("id", pageId);

  if (clientSlug) {
    query = query.eq("client_slug", clientSlug);
  }

  const { data, error } = await query.single();
  if (error || !data) return null;
  return data as WorkspacePage;
}

export async function getWorkspaceTasks(
  clientSlug?: string,
): Promise<WorkspaceTask[]> {
  if (!supabaseAdmin) return [];

  let query = supabaseAdmin
    .from("workspace_tasks")
    .select("*")
    .order("position", { ascending: true });

  if (clientSlug) {
    query = query.eq("client_slug", clientSlug);
  }

  const { data } = await query;
  return (data as WorkspaceTask[]) ?? [];
}
