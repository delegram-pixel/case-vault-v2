import { Skeleton } from "@/components/ui/skeleton";

export default function CaseDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      </div>
      <Skeleton className="h-9 w-96 max-w-full rounded-lg" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
