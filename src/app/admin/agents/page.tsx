export default function AgentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Agent Status</h1>
      <div className="space-y-2">
        {["ticketmaster-scraper", "meta-ads-manager", "campaign-monitor"].map((agent) => (
          <div key={agent} className="border rounded p-3 flex items-center justify-between">
            <span className="text-sm font-mono">{agent}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">idle</span>
          </div>
        ))}
      </div>
    </div>
  );
}
