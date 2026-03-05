import { getPages } from "./data";
import { PageList } from "@/components/workspace/page-list";

export default async function WorkspacePage() {
  const { pages } = await getPages();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Workspace</h1>
        <p className="text-sm text-white/40 mt-1">
          Documents and notes for your team
        </p>
      </div>
      <PageList pages={pages} basePath="/admin/workspace" />
    </div>
  );
}
