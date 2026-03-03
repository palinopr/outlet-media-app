export const metadata = {
  title: "Data Deletion Status - Outlet Media",
};

export default async function DeletionStatusPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Data Deletion Request</h1>
      <p className="text-muted-foreground">
        Your data deletion request has been received and processed.
      </p>
      <div className="glass-card p-4 inline-block">
        <p className="text-sm text-muted-foreground">Confirmation code</p>
        <p className="font-mono text-lg">{code}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        All associated data has been removed from our systems. If you have questions, contact us at support@outletmedia.co
      </p>
    </div>
  );
}
