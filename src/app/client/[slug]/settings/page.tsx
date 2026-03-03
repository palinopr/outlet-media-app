import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getConnectedAccounts } from "./data";
import { ConnectedAccountsList } from "./connected-accounts-list";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const accounts = await getConnectedAccounts(userId, slug);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your connected ad accounts
        </p>
      </div>

      <ConnectedAccountsList
        accounts={accounts}
        slug={slug}
        connectUrl={`/api/meta/connect?slug=${slug}`}
      />
    </div>
  );
}
