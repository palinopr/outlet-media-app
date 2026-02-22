import { clerkClient } from "@clerk/nextjs/server";
import { UserTable } from "@/components/admin/users/user-table";
import { Users, Shield, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

async function getUsers() {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkEnabled) return [];

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({ limit: 100 });

    return users.map((u) => {
      const meta = (u.publicMetadata ?? {}) as {
        role?: string;
        client_slug?: string;
      };
      return {
        id: u.id,
        name: [u.firstName, u.lastName].filter(Boolean).join(" "),
        email: u.emailAddresses[0]?.emailAddress ?? "",
        role: meta.role ?? null,
        client_slug: meta.client_slug ?? null,
        created_at: new Date(u.createdAt).toISOString(),
      };
    });
  } catch {
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();

  const adminCount = users.filter((u) => u.role === "admin").length;
  const clientCount = users.filter((u) => u.role !== "admin").length;

  const stats = [
    { label: "Total Users", value: String(users.length), icon: Users, accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
    { label: "Admins", value: String(adminCount), icon: Shield, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
    { label: "Client Users", value: String(clientCount), icon: UserCheck, accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage team members and client portal access
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, accent, iconColor }) => (
          <div key={label} className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border/80 hover:shadow-lg hover:shadow-black/20">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className={`h-7 w-7 rounded-lg bg-white/[0.06] flex items-center justify-center ${iconColor}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <UserTable users={users} />
    </div>
  );
}
