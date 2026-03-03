import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getConnectedAccounts, getSettingsData } from "./data";
import { ConnectedAccountsList } from "./connected-accounts-list";
import { SettingsView } from "./settings-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [accounts, settingsData] = await Promise.all([
    getConnectedAccounts(userId, slug),
    getSettingsData(slug),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your team and connected ad accounts
        </p>
      </div>

      {settingsData && <SettingsView data={settingsData} />}

      <ConnectedAccountsList
        accounts={accounts}
        slug={slug}
        connectUrl={`/api/meta/connect?slug=${slug}`}
      />
    </div>
  );
}
