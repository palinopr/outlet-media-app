import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { getClientPage } from "../data";
import { PageTitle } from "@/components/workspace/page-title";
import { PageIcon } from "@/components/workspace/page-icon";
import { PageCover } from "@/components/workspace/page-cover";
import { PlateEditor } from "@/components/workspace/plate-editor";

interface Props {
  params: Promise<{ slug: string; pageId: string }>;
}

export default async function ClientWorkspacePageView({ params }: Props) {
  const { slug, pageId } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) redirect("/client");

  const page = await getClientPage(pageId, slug);
  if (!page) notFound();

  return (
    <div className="space-y-4">
      <PageCover pageId={page.id} coverImage={page.cover_image} />
      <div className="flex items-start gap-3">
        <PageIcon pageId={page.id} currentIcon={page.icon} />
        <div className="flex-1 min-w-0 pt-1">
          <PageTitle pageId={page.id} initialTitle={page.title} />
        </div>
      </div>
      <div className="mt-4">
        <PlateEditor pageId={page.id} initialContent={page.content} />
      </div>
    </div>
  );
}
