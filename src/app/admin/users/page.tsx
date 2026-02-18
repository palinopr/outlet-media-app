import { clerkClient } from "@clerk/nextjs/server";
import { UserTable } from "@/components/admin/users/user-table";

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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} total &mdash; {adminCount} admin, {clientCount} client
          </p>
        </div>
      </div>

      <UserTable users={users} />
    </div>
  );
}
