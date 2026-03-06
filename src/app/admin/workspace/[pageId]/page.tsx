import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWorkspacePage } from "@/features/workspace/server";
import { PageViewClient } from "@/components/workspace/page-view-client";

interface Props {
  params: Promise<{ pageId: string }>;
}

export default async function WorkspacePageView({ params }: Props) {
  const { pageId } = await params;
  const [page, { userId }] = await Promise.all([getWorkspacePage(pageId), auth()]);

  if (!page) notFound();

  return <PageViewClient page={page} currentUserId={userId ?? ""} clientSlug="admin" />;
}
