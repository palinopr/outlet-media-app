import { redirect } from "next/navigation";

export const metadata = { title: "Approvals" };

export default function AdminApprovalsPage() {
  redirect("/admin/dashboard");
}
