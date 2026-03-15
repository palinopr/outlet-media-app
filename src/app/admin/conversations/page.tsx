import { redirect } from "next/navigation";

export const metadata = { title: "Conversations" };

export default function AdminConversationsPage() {
  redirect("/admin/dashboard");
}
