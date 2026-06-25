import type { Metadata } from "next";
import { Suspense } from "react";
import { CaseSearchView } from "@/components/case-search-view";

export const metadata: Metadata = {
  title: "Case Search",
  description: "Search the public court registry by case number.",
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Public Case Search
        </h1>
        <p className="text-muted-foreground mt-2">
          Anyone can look up a case by its number. Sensitive details remain
          restricted to authorised parties.
        </p>
      </div>
      <Suspense>
        <CaseSearchView />
      </Suspense>
    </div>
  );
}
