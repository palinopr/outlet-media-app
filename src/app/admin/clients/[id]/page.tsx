import { notFound } from "next/navigation";
import { getClientDetail } from "../data";
import { ClientDetailView } from "@/components/admin/clients/client-detail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await getClientDetail(id);
  if (!client) notFound();

  return <ClientDetailView client={client} />;
}
