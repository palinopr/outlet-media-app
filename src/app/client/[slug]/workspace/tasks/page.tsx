import { TaskBoard } from "@/components/workspace/task-board";
import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkspaceTasks } from "@/features/workspace/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientTasksPage({ params }: Props) {
  const { slug } = await params;
  await requireClientAccess(slug, "workspace");
  const tasks = await getWorkspaceTasks(slug);

  return (
    <div className="max-w-full mx-auto px-6 py-8 space-y-6">
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
