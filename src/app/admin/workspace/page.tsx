import { getPages } from "./data";
import { PageList } from "@/components/workspace/page-list";

export default async function WorkspacePage() {
  const { pages } = await getPages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Documents and notes for your team
        </p>
      </div>
      <PageList pages={pages} basePath="/admin/workspace" />
    </div>
  );
}
