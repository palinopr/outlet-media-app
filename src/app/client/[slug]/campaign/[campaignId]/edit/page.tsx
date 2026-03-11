import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ campaignId: string; slug: string }>;
}

export default async function ClientCampaignEditPage({ params }: Props) {
  const { slug, campaignId } = await params;
  redirect(`/client/${slug}/campaign/${campaignId}`);
}
