import { currentUser } from "@clerk/nextjs/server";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import type { WorkspacePage, WorkspaceTask } from "@/lib/workspace-types";

export async function getWorkspaceReadClient(clientSlug?: string) {
  if (!clientSlug || clientSlug === "admin") {
    return supabaseAdmin;
  }

  try {
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string } | null)?.role;
    if (role === "admin") {
      return supabaseAdmin;
    }
  } catch {
    return supabaseAdmin;
  }

  return (await createClerkSupabaseClient()) ?? supabaseAdmin;
}

export async function getWorkspacePages(clientSlug?: string): Promise<{
  pages: WorkspacePage[];
  fromDb: boolean;
}> {
  const db = await getWorkspaceReadClient(clientSlug);
  if (!db) return { pages: [], fromDb: false };

  let query = db
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
  const db = await getWorkspaceReadClient(clientSlug);
  if (!db) return null;

  let query = db
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
  const db = await getWorkspaceReadClient(clientSlug);
  if (!db) return [];

  let query = db
    .from("workspace_tasks")
    .select("*")
    .order("position", { ascending: true });

  if (clientSlug) {
    query = query.eq("client_slug", clientSlug);
  }

  const { data } = await query;
  return (data as WorkspaceTask[]) ?? [];
}
