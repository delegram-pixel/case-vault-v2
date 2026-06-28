import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { PartiesView } from "@/components/dashboard/parties-view";
import { getAllParties, getAllAttorneys } from "@/lib/queries";

export const metadata: Metadata = { title: "Parties" };

export default async function PartiesPage() {
  const [allParties, allAttorneys] = await Promise.all([
    getAllParties(),
    getAllAttorneys(),
  ]);
  return (
    <div className="space-y-6">
      <PageHeader
        title="People & Representation"
        description="Everyone on record across the registry — parties and their counsel."
      />
      <PartiesView allParties={allParties} allAttorneys={allAttorneys} />
    </div>
  );
}
