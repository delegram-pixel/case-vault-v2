"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function RootError({
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
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <Logo href="/" className="mb-8" />
      <div className="bg-status-closed-bg text-status-closed grid size-14 place-items-center rounded-xl">
        <AlertTriangle className="size-7" />
      </div>
      <h1 className="font-serif mt-5 text-3xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>
          <RotateCcw /> Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
