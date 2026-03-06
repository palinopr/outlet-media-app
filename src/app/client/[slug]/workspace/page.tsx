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
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Workspace</h1>
        <p className="text-sm text-white/50 mt-1">
          Shared documents and notes
        </p>
      </div>
      <PageList pages={pages} basePath={`/client/${slug}/workspace`} />
    </div>
  );
}
