import type { Metadata } from "next";
import { CheckCircle2, Clock, ShieldX, UserCheck } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { VerificationsView } from "@/components/dashboard/verifications-view";
import { getAttorneys } from "@/lib/queries";

export const metadata: Metadata = { title: "Verifications" };

export default async function VerificationsPage() {
  const records = await getAttorneys();
  const pending = records.filter((v) => v.status === "Pending").length;
  const verified = records.filter((v) => v.status === "Verified").length;
  const rejected = records.filter((v) => v.status === "Rejected").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practitioner Verification"
        description="Confirm attorneys against the roll before granting filing access."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Awaiting review" value={pending} sub="in the queue" icon={Clock} />
        <StatCard label="Verified" value={verified} sub="active practitioners" icon={CheckCircle2} />
        <StatCard label="Rejected" value={rejected} sub="failed checks" icon={ShieldX} />
        <StatCard label="Total applicants" value={records.length} sub="all time" icon={UserCheck} />
      </div>
      <VerificationsView records={records} />
    </div>
  );
}
