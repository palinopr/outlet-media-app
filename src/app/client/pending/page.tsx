import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PendingPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4 max-w-sm">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mx-auto">
          <span className="text-white text-lg font-bold">O</span>
        </div>
        <h1 className="text-lg font-semibold">No Portal Access Yet</h1>
        <p className="text-sm text-muted-foreground">
          If you were invited, sign in with the same email that received the
          invite. If you still land here after accepting the invite, your portal
          access has not finished syncing yet.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/sign-in">Sign in again</Link>
        </Button>
      </div>
    </div>
  );
}
