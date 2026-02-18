export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Active Campaigns</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Total Spend</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Events Tracked</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
      </div>
    </div>
  );
}
