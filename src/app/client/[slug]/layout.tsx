import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ClientLayout({ children, params }: Props) {
  const { slug } = await params;
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <p className="font-semibold text-sm text-gray-500 mb-1">CLIENT PORTAL</p>
        <p className="text-xs text-gray-400 mb-4 uppercase">{slug}</p>
        <nav className="space-y-1">
          <a href={`/client/${slug}`} className="block px-3 py-2 rounded text-sm hover:bg-gray-100">Overview</a>
          <a href={`/client/${slug}/campaigns`} className="block px-3 py-2 rounded text-sm hover:bg-gray-100">Campaigns</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
