import Link from "next/link";
import { getUsers } from "./data";
import { getClientSummaries } from "../clients/data";
import { UserTable } from "@/components/admin/users/user-table";
import { Users, Shield, UserCheck, Clock, ArrowRight, MailPlus, UserRoundX } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { slugToLabel } from "@/lib/formatters";
import { buildUsersAccessSummary } from "@/features/users/summary";

import { AdminPageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, clients] = await Promise.all([getUsers(), getClientSummaries()]);

  const activeUsers = users.filter((u) => u.status === "active");
  const invitedCount = users.filter((u) => u.status === "invited").length;
  const adminCount = activeUsers.filter((u) => u.role === "admin").length;
  const clientCount = activeUsers.filter((u) => u.role !== "admin").length;
  const pendingCount =
    activeUsers.filter((u) => u.role !== "admin" && u.client_slugs.length === 0).length +
    invitedCount;
  const accessSummary = buildUsersAccessSummary(users, clients);

  const stats = [
    { label: "Total Users", value: String(users.length), icon: Users, accent: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400" },
    { label: "Admins", value: String(adminCount), icon: Shield, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
    { label: "Client Users", value: String(clientCount), icon: UserCheck, accent: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
    { label: "Pending", value: String(pendingCount), icon: Clock, accent: "from-amber-500/20 to-yellow-500/20", iconColor: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Manage team members and client portal access"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="border-border/60">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Pending invites</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Invitations that still have not turned into active users.
                </p>
              </div>
              <MailPlus className="h-4 w-4 text-muted-foreground" />
            </div>
            {accessSummary.pendingInvites.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending invites right now.
              </p>
            ) : (
              <div className="space-y-3">
                {accessSummary.pendingInvites.map((invite) => (
                  <div key={invite.id} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium">{invite.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {invite.client_slug ? slugToLabel(invite.client_slug) : "No client selected"} • Invited
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Unassigned client users</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Active client-facing users who still do not have portal assignments.
                </p>
              </div>
              <UserRoundX className="h-4 w-4 text-muted-foreground" />
            </div>
            {accessSummary.unassignedClientUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All active client-facing users have at least one client assignment.
              </p>
            ) : (
              <div className="space-y-3">
                {accessSummary.unassignedClientUsers.map((user) => (
                  <div key={user.id} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium">{user.name || user.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.email} • {user.role ?? "client"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Clients needing coverage</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Client accounts with only one or zero assigned members.
                </p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            {accessSummary.clientsNeedingCoverage.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Every client currently has at least two assigned members.
              </p>
            ) : (
              <div className="space-y-3">
                {accessSummary.clientsNeedingCoverage.map((client) => (
                  <Link
                    key={client.id}
                    href={`/admin/clients/${client.id}`}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/35"
                  >
                    <div>
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {client.memberCount} member{client.memberCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UserTable users={users} clients={clients.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))} />
    </div>
  );
}
