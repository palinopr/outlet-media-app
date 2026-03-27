import { redirect } from "next/navigation";

interface ClientPortalRootPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ClientPortalRootPage({
  params,
}: ClientPortalRootPageProps) {
  const { slug } = await params;

  redirect(`/client/${slug}/campaigns`);
}
