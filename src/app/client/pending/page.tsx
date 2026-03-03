import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function PendingPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4 max-w-sm">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mx-auto">
          <span className="text-white text-lg font-bold">O</span>
        </div>
        <h1 className="text-lg font-semibold">Account Pending Approval</h1>
        <p className="text-sm text-muted-foreground">
          Your account has been created. An admin at Outlet Media will review
          and assign you to a client portal. You will get access once approved.
        </p>
        <SignOutButton>
          <Button variant="outline" size="sm">
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
