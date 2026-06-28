"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="bg-status-closed-bg text-status-closed grid size-14 place-items-center rounded-xl">
        <AlertTriangle className="size-7" />
      </div>
      <h1 className="font-serif mt-5 text-2xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        We hit an unexpected error loading this page. You can try again — if it
        keeps happening, the registry team has been notified.
      </p>
      <Button onClick={reset} className="mt-6">
        <RotateCcw /> Try again
      </Button>
    </div>
  );
}
