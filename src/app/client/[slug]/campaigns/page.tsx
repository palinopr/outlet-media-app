interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientCampaigns({ params }: Props) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Campaigns</h1>
      <p className="text-gray-500 text-sm">No campaigns assigned to {slug} yet.</p>
    </div>
  );
}
