import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkspacePages } from "@/features/workspace/server";
import { PageList } from "@/components/workspace/page-list";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientWorkspacePage({ params }: Props) {
  const { slug } = await params;
  await requireClientAccess(slug, "workspace");
  const { pages } = await getWorkspacePages(slug);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <p className="text-sm font-medium text-[#9b9a97]">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2f2f2f]">
          Shared documents and notes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#787774]">
          This is the shared workspace for plans, updates, and context your team can review together.
        </p>
      </div>
      <PageList pages={pages} basePath={`/client/${slug}/workspace`} />
    </div>
  );
}
