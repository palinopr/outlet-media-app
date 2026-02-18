import { redirect } from "next/navigation";

// Temporary: redirect to admin until auth is set up
export default function RootPage() {
  redirect("/admin/dashboard");
}
