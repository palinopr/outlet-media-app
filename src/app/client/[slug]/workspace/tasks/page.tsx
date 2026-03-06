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
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <p className="text-sm font-medium text-[#9b9a97]">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2f2f2f]">Tasks</h1>
        <p className="mt-2 text-sm text-[#787774]">
          Track and manage work for your team
        </p>
      </div>
      <TaskBoard tasks={tasks} clientSlug={slug} />
    </div>
  );
}
