import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { getClientPages } from "./data";
import { PageList } from "@/components/workspace/page-list";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientWorkspacePage({ params }: Props) {
  const { slug } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const access = await getMemberAccessForSlug(userId, slug);
  if (!access) redirect("/client");

  const { pages } = await getClientPages(slug);

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
