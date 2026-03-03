import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSettingsData } from "./data";
import { SettingsView } from "./settings-view";

// ConnectedAccountsList + connect flow hidden -- enable when white-label self-serve is ready

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const settingsData = await getSettingsData(slug);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your team
        </p>
      </div>

      {settingsData && <SettingsView data={settingsData} />}
    </div>
  );
}
