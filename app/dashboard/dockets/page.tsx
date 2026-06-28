import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { DocketsView } from "@/components/dashboard/dockets-view";
import { getAllDocket } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dockets" };

export default async function DocketsPage() {
  const docket = await getAllDocket();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Docket Log"
        description="A chronological, tamper-evident record of every filing and order."
      />
      <DocketsView docket={docket} />
    </div>
  );
}
