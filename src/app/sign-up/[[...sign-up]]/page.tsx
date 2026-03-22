import { SignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

interface SignUpPageProps {
  searchParams?: Promise<{
    invite_id?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const inviteId = typeof params?.invite_id === "string" ? params.invite_id : null;
  const forceRedirectUrl = inviteId
    ? `/client?invite_id=${encodeURIComponent(inviteId)}`
    : "/client";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <SignUp
        forceRedirectUrl={forceRedirectUrl}
        signInForceRedirectUrl={forceRedirectUrl}
      />
    </div>
  );
}
