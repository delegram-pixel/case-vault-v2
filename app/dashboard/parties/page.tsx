import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { PartiesView } from "@/components/dashboard/parties-view";

export const metadata: Metadata = { title: "Parties" };

export default function PartiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="People & Representation"
        description="Everyone on record across the registry — parties and their counsel."
      />
      <PartiesView />
    </div>
  );
}
