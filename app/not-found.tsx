import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <Logo href="/" className="mb-8" />
      <div className="bg-secondary text-secondary-foreground grid size-14 place-items-center rounded-xl">
        <FileQuestion className="size-7" />
      </div>
      <h1 className="font-serif mt-5 text-3xl font-bold tracking-tight">
        Record not found
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        We couldn&apos;t find the page or case you were looking for. It may have
        been moved or never existed.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">Search cases</Link>
        </Button>
      </div>
    </div>
  );
}
