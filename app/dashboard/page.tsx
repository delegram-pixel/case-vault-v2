import Link from "next/link";
import {
  CalendarClock,
  FilePlus2,
  FolderOpen,
  Scale,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CasesTable } from "@/components/dashboard/cases-table";
import { CASES } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const open = CASES.filter((c) => c.status === "Open").length;
  const pending = CASES.filter((c) => c.status === "Pending").length;
  const upcoming = CASES.flatMap((c) => c.hearings)
    .filter((h) => h.status === "Scheduled")
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime));

  const stats = [
    { label: "Total cases", value: CASES.length, icon: FolderOpen, sub: "across all courts" },
    { label: "Open", value: open, icon: Scale, sub: "active matters" },
    { label: "Pending", value: pending, icon: TrendingUp, sub: "awaiting action" },
    { label: "Upcoming hearings", value: upcoming.length, icon: CalendarClock, sub: "scheduled" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            Case Registry
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Good morning, Funke. Here is what&apos;s on the docket today.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/cases/new">
            <FilePlus2 /> File a case
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{s.label}</p>
              <s.icon className="text-muted-foreground size-4" />
            </div>
            <p className="font-serif mt-2 text-3xl font-bold">{s.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold">All cases</h2>
          <CasesTable />
        </div>

        {/* Upcoming hearings rail */}
        <div>
          <h2 className="mb-3 text-sm font-semibold">Upcoming hearings</h2>
          <div className="bg-card divide-y rounded-xl border shadow-sm">
            {upcoming.slice(0, 5).map((h) => (
              <div key={h.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-secondary text-secondary-foreground grid size-9 shrink-0 place-items-center rounded-lg">
                    <CalendarClock className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{h.eventType}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDateTime(h.dateTime)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {h.roomNumber} · {h.judge}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <p className="text-muted-foreground p-6 text-center text-sm">
                No hearings scheduled.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
