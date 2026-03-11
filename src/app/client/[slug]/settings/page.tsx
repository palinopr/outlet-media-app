import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientMetaSettingsPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/client/${slug}`);
}
