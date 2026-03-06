import { TaskBoard } from "@/components/workspace/task-board";
import { WorkQueueSection } from "@/components/workflow/work-queue-section";
import { getWorkQueue } from "@/features/work-queue/server";
import { getWorkspaceTasks } from "@/features/workspace/server";

interface Props {
  searchParams: Promise<{ client_slug?: string }>;
}

export default async function AdminTasksPage({ searchParams }: Props) {
  const { client_slug } = await searchParams;
  const [tasks, workQueue] = await Promise.all([
    getWorkspaceTasks(client_slug),
    getWorkQueue({
      clientSlug: client_slug ?? null,
      limit: 12,
      mode: "admin",
    }),
  ]);

  // Derive a slug for the board -- use the filter or the first task's slug or a default
  const boardSlug = client_slug ?? tasks[0]?.client_slug ?? "default";

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <p className="text-sm font-medium text-[#9b9a97]">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2f2f2f]">Tasks</h1>
        <p className="mt-2 text-sm text-[#787774]">
          Work the cross-app queue first, then manage generic workspace tasks below.
        </p>
      </div>
      <WorkQueueSection
        description="Cross-app next steps across campaigns, CRM, events, and creative review."
        showClientSlug={!client_slug}
        summary={workQueue}
        title="Operating queue"
        variant="admin"
      />
      <TaskBoard tasks={tasks} clientSlug={boardSlug} />
    </div>
  );
}
