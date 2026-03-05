import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getPage } from "../data";
import { PageViewClient } from "@/components/workspace/page-view-client";

interface Props {
  params: Promise<{ pageId: string }>;
}

export default async function WorkspacePageView({ params }: Props) {
  const { pageId } = await params;
  const [page, { userId }] = await Promise.all([getPage(pageId), auth()]);

  if (!page) notFound();

  return <PageViewClient page={page} currentUserId={userId ?? ""} />;
}
