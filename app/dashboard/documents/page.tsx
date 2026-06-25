import type { Metadata } from "next";
import { FileText, FolderClosed, HardDrive, ShieldCheck } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { DocumentsView } from "@/components/dashboard/documents-view";
import { ALL_DOCUMENTS } from "@/lib/aggregates";

export const metadata: Metadata = { title: "Documents" };

export default function DocumentsPage() {
  const types = new Set(ALL_DOCUMENTS.map((d) => d.type)).size;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Vault"
        description="Every pleading, exhibit and order — stored securely off-site."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Documents" value={ALL_DOCUMENTS.length} sub="across all cases" icon={FileText} />
        <StatCard label="Categories" value={types} sub="document types" icon={FolderClosed} />
        <StatCard label="Storage" value="8.4 MB" sub="of 50 GB used" icon={HardDrive} />
        <StatCard label="Encryption" value="AES-256" sub="at rest & in transit" icon={ShieldCheck} />
      </div>
      <DocumentsView />
    </div>
  );
}
