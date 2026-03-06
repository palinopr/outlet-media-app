import type { ReactNode } from "react";
import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkspacePages } from "@/features/workspace/server";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";

interface Props {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ClientWorkspaceLayout({ children, params }: Props) {
  const { slug } = await params;
  await requireClientAccess(slug, "workspace");
  const { pages } = await getWorkspacePages(slug);

  return (
    <WorkspaceFrame
      pages={pages}
      basePath={`/client/${slug}/workspace`}
      clientSlug={slug}
    >
      {children}
    </WorkspaceFrame>
  );
}
