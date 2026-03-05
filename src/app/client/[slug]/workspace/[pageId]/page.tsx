import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { getClientPage } from "../data";
import { PageViewClient } from "@/components/workspace/page-view-client";

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

  return <PageViewClient page={page} currentUserId={userId} />;
}
