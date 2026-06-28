import type { Metadata } from "next";
import { Activity, ScrollText } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { AuditView } from "@/components/dashboard/audit-view";
import { getAuditLog } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Audit Log" };

export default async function AuditPage() {
  await requireRole("ADMIN");
  const entries = await getAuditLog();
  const today = entries.filter(
    (e) => new Date(e.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="A tamper-evident record of every privileged action across the registry."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Recent events" value={entries.length} sub="last 200 actions" icon={ScrollText} />
        <StatCard label="Today" value={today} sub="actions logged today" icon={Activity} />
        <StatCard
          label="Action types"
          value={new Set(entries.map((e) => e.action)).size}
          sub="distinct actions"
          icon={Activity}
        />
      </div>
      <AuditView entries={entries} />
    </div>
  );
}
