import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientMetaConnectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/client/${slug}`);
}
