import { TaskBoard } from "@/components/workspace/task-board";
import { getWorkspaceTasks } from "@/features/workspace/server";

interface Props {
  searchParams: Promise<{ client_slug?: string }>;
}

export default async function AdminTasksPage({ searchParams }: Props) {
  const { client_slug } = await searchParams;
  const tasks = await getWorkspaceTasks(client_slug);

  // Derive a slug for the board -- use the filter or the first task's slug or a default
  const boardSlug = client_slug ?? tasks[0]?.client_slug ?? "default";

  return (
    <div className="max-w-full mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white/90">Tasks</h1>
        <p className="text-sm text-white/40 mt-1">
          Manage tasks across all clients
        </p>
      </div>
      <TaskBoard tasks={tasks} clientSlug={boardSlug} />
    </div>
  );
}
