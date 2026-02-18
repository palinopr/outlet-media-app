interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientDashboard({ params }: Props) {
  const { slug } = await params;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Welcome</h1>
      <p className="text-gray-500 text-sm mb-6">Account: {slug}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Active Campaigns</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Total Reach</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
      </div>
    </div>
  );
}
