import type { Metadata } from "next";
import { CourtFinder } from "@/components/court-finder";
import { getCourts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Find a Court",
  description:
    "Find Nigerian state and federal courts by type and state. View address, phone, hours and directions.",
};

export default async function FindPage() {
  const courts = await getCourts();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Court Finder
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-pretty">
          Four quick steps — choose a court type, pick a state, then search a case
          or browse branches near you. No account needed.
        </p>
      </div>
      <CourtFinder courts={courts} />
    </div>
  );
}
