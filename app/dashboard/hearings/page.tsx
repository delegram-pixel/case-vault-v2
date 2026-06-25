import type { Metadata } from "next";
import { CalendarCheck, CalendarClock, CalendarX2, Clock } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { HearingScheduler } from "@/components/dashboard/hearing-scheduler";
import { ALL_HEARINGS } from "@/lib/aggregates";

export const metadata: Metadata = { title: "Hearings" };

export default function HearingsPage() {
  const now = new Date();
  const inWeek = new Date(now.getTime() + 7 * 864e5);
  const scheduled = ALL_HEARINGS.filter((h) => h.status === "Scheduled");
  const thisWeek = scheduled.filter((h) => {
    const d = new Date(h.dateTime);
    return d >= now && d <= inWeek;
  });
  const adjourned = ALL_HEARINGS.filter((h) => h.status === "Adjourned");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hearing Scheduler"
        description="Plan and track every sitting, with automatic conflict detection."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Scheduled" value={scheduled.length} sub="upcoming sittings" icon={CalendarClock} />
        <StatCard label="This week" value={thisWeek.length} sub="next 7 days" icon={Clock} />
        <StatCard label="Completed" value={ALL_HEARINGS.filter((h) => h.status === "Completed").length} sub="concluded" icon={CalendarCheck} />
        <StatCard label="Adjourned" value={adjourned.length} sub="rescheduled" icon={CalendarX2} />
      </div>

      <HearingScheduler />
    </div>
  );
}
