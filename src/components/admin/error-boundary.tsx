"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        An unexpected error occurred. The error has been logged. Please try again.
      </p>
      {error.message && (
        <p className="text-xs text-red-400/70 font-mono max-w-lg text-center truncate">
          {error.message}
        </p>
      )}
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
