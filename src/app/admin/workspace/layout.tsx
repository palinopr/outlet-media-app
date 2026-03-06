import type { ReactNode } from "react";
import { getWorkspacePages } from "@/features/workspace/server";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const { pages } = await getWorkspacePages("admin");

  return (
    <WorkspaceFrame pages={pages} basePath="/admin/workspace" clientSlug="admin">
      {children}
    </WorkspaceFrame>
  );
}
