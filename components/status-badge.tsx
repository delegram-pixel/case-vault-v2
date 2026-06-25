import { cn } from "@/lib/utils";
import type { CaseStatus } from "@/lib/types";

const STATUS_STYLES: Record<CaseStatus, string> = {
  Open: "bg-status-open-bg text-status-open border-status-open/20",
  Pending: "bg-status-pending-bg text-status-pending border-status-pending/20",
  Closed: "bg-status-closed-bg text-status-closed border-status-closed/20",
};

const DOT: Record<CaseStatus, string> = {
  Open: "bg-status-open",
  Pending: "bg-status-pending",
  Closed: "bg-status-closed",
};

export function StatusBadge({
  status,
  className,
}: {
  status: CaseStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT[status])} />
      {status}
    </span>
  );
}
