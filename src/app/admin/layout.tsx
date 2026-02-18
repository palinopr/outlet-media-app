import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <p className="font-semibold text-sm text-gray-500 mb-4">OUTLET MEDIA</p>
        <nav className="space-y-1">
          <a href="/admin/dashboard" className="block px-3 py-2 rounded text-sm hover:bg-gray-100">Dashboard</a>
          <a href="/admin/campaigns" className="block px-3 py-2 rounded text-sm hover:bg-gray-100">Campaigns</a>
          <a href="/admin/events" className="block px-3 py-2 rounded text-sm hover:bg-gray-100">Events</a>
          <a href="/admin/agents" className="block px-3 py-2 rounded text-sm hover:bg-gray-100">Agents</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
