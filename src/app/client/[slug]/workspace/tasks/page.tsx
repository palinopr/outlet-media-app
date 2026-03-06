import { TaskBoard } from "@/components/workspace/task-board";
import { WorkQueueSection } from "@/components/workflow/work-queue-section";
import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkQueue } from "@/features/work-queue/server";
import { getWorkspaceTasks } from "@/features/workspace/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientTasksPage({ params }: Props) {
  const { slug } = await params;
  const { scope } = await requireClientAccess(slug, "workspace");
  const [tasks, workQueue] = await Promise.all([
    getWorkspaceTasks(slug),
    getWorkQueue({
      clientSlug: slug,
      limit: 10,
      mode: "client",
      scope,
    }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <p className="text-sm font-medium text-[#9b9a97]">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2f2f2f]">Tasks</h1>
        <p className="mt-2 text-sm text-[#787774]">
          Track the shared next steps across campaigns, CRM, events, and creative review.
        </p>
      </div>
      <WorkQueueSection
        description="Shared work that needs attention before it falls back into the generic task board."
        summary={workQueue}
        title="Shared work queue"
        variant="client"
      />
      <TaskBoard tasks={tasks} clientSlug={slug} />
    </div>
  );
}
