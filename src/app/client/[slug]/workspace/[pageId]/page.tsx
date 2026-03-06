import { notFound } from "next/navigation";
import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkspacePage } from "@/features/workspace/server";
import { PageViewClient } from "@/components/workspace/page-view-client";

interface Props {
  params: Promise<{ slug: string; pageId: string }>;
}

export default async function ClientWorkspacePageView({ params }: Props) {
  const { slug, pageId } = await params;
  const { userId } = await requireClientAccess(slug, "workspace");

  const page = await getWorkspacePage(pageId, slug);
  if (!page) notFound();

  return <PageViewClient page={page} currentUserId={userId} clientSlug={slug} />;
}
