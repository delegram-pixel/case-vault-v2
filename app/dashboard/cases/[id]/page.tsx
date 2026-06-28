import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Gavel, Landmark, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { CaseActions } from "@/components/dashboard/case-actions";
import { CaseDetailTabs } from "@/components/dashboard/case-detail-tabs";
import { getCaseById } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const c = await getCaseById(params.id);
  return { title: c ? `${c.caseNumber} — ${c.title}` : "Case not found" };
}

export default async function CaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [c, user] = await Promise.all([
    getCaseById(params.id),
    getCurrentUser(),
  ]);
  if (!c) notFound();

  const canEdit = !!user && ["CLERK", "ADMIN"].includes(user.role);
  const canDocket = !!user && ["CLERK", "ADMIN", "JUDGE"].includes(user.role);

  const meta = [
    { icon: Landmark, label: "Court", value: c.courtType },
    { icon: MapPin, label: "State", value: c.courtState },
    { icon: Gavel, label: "Presiding", value: c.judge },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeft className="size-4" /> Back to registry
      </Link>

      {/* Header */}
      <div className="bg-card rounded-xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-muted-foreground font-mono text-xs">
                {c.caseNumber}
              </p>
              <StatusBadge status={c.status} />
            </div>
            <h1 className="font-serif mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
              {c.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              {c.description}
            </p>
          </div>
          <CaseActions
            caseId={c.id}
            caseNumber={c.caseNumber}
            status={c.status}
            title={c.title}
            description={c.description}
            canEdit={canEdit}
            canStatus={canDocket}
          />
        </div>

        <div className="mt-5 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="bg-card p-3">
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <m.icon className="size-3.5" /> {m.label}
              </p>
              <p className="mt-0.5 text-sm font-medium">{m.value}</p>
            </div>
          ))}
          <div className="bg-card p-3">
            <p className="text-muted-foreground text-xs">Filed</p>
            <p className="mt-0.5 text-sm font-medium">{formatDate(c.filingDate)}</p>
          </div>
        </div>
      </div>

      <CaseDetailTabs
        caseRecord={c}
        canEdit={canEdit}
        canDocket={canDocket}
        userName={user?.name ?? "Registry"}
      />
    </div>
  );
}
