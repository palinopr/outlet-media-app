import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { TaskBoard } from "@/components/workspace/task-board";
import type { WorkspaceTask } from "@/lib/workspace-types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientTasksPage({ params }: Props) {
  const { slug } = await params;

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) redirect("/client");

  let tasks: WorkspaceTask[] = [];

  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("workspace_tasks")
      .select("*")
      .eq("client_slug", slug)
      .order("position", { ascending: true });

    tasks = (data as WorkspaceTask[]) ?? [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white/90">Tasks</h1>
        <p className="text-sm text-white/40 mt-1">
          Track and manage work for your team
        </p>
      </div>
      <TaskBoard tasks={tasks} clientSlug={slug} />
    </div>
  );
}
