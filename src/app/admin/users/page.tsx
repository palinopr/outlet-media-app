import { getUsers } from "./data";
import { getClientSummaries } from "../clients/data";
import { UserTable } from "@/components/admin/users/user-table";
import { Users, Shield, UserCheck, Clock } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, clients] = await Promise.all([getUsers(), getClientSummaries()]);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const clientCount = users.filter((u) => u.role !== "admin").length;
  const pendingCount = users.filter((u) => u.role !== "admin" && !u.client_slug).length;

  const stats = [
    { label: "Total Users", value: String(users.length), icon: Users, accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
    { label: "Admins", value: String(adminCount), icon: Shield, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
    { label: "Client Users", value: String(clientCount), icon: UserCheck, accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
    { label: "Pending", value: String(pendingCount), icon: Clock, accent: "from-amber-500/20 to-yellow-500/20", iconColor: "text-amber-400" },
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
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <UserTable users={users} clients={clients.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))} />
    </div>
  );
}
