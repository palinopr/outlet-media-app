import { getWorkspacePages } from "@/features/workspace/server";
import { PageList } from "@/components/workspace/page-list";

export default async function WorkspacePage() {
  const { pages } = await getWorkspacePages();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <p className="text-sm font-medium text-[#9b9a97]">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2f2f2f]">
          Documents and knowledge
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#787774]">
          Your internal pages, briefs, and working notes in one place.
        </p>
      </div>
      <PageList pages={pages} basePath="/admin/workspace" />
    </div>
  );
}
