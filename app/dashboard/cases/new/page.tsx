import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CaseFilingForm } from "@/components/dashboard/case-filing-form";

export const metadata: Metadata = { title: "File a Case" };

export default function NewCasePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="size-4" /> Back to registry
        </Link>
        <h1 className="font-serif mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          File a new case
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Record the matter, its parties, and representation. Fields marked * are
          required.
        </p>
      </div>
      <CaseFilingForm />
    </div>
  );
}
