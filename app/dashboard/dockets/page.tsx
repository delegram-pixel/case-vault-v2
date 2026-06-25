import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { DocketsView } from "@/components/dashboard/dockets-view";

export const metadata: Metadata = { title: "Dockets" };

export default function DocketsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Docket Log"
        description="A chronological, tamper-evident record of every filing and order."
      />
      <DocketsView />
    </div>
  );
}
