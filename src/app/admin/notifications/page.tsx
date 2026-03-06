import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { BellRing } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { NotificationsCenter } from "@/components/workspace/notifications-center";
import { listNotificationsForUser } from "@/features/notifications/server";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function AdminNotificationsPage() {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const { userId } = clerkEnabled ? await auth() : { userId: null };
  const notifications = userId ? await listNotificationsForUser(userId) : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notifications"
        description="A dedicated inbox for approvals, discussion, assignments, and routed workflow updates."
      >
        <span className="inline-flex items-center gap-1.5 rounded border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300">
          <BellRing className="h-3.5 w-3.5" />
          Admin inbox
        </span>
      </AdminPageHeader>

      <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
        <div className="mb-4">
          <p className="text-sm font-medium text-[#9b9a97]">Inbox</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
            Routed workflow notifications
          </h2>
          <p className="mt-1 text-sm text-[#9b9a97]">
            Approval decisions, comments, assignments, and workflow events routed only to your admin inbox.
          </p>
        </div>
        <NotificationsCenter initialNotifications={notifications} viewer="admin" />
      </section>
    </div>
  );
}
