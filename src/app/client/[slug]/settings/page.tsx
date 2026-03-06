import { getSettingsData } from "./data";
import { SettingsView } from "./settings-view";
import { requireClientAccess } from "@/features/client-portal/access";

// ConnectedAccountsList + connect flow hidden -- enable when white-label self-serve is ready

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireClientAccess(slug);

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
