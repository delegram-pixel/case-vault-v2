"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mail, ShieldCheck, ShieldX, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  LawyerVerification,
  VerificationStatus,
} from "@/lib/admin-data";
import { setVerification } from "@/app/dashboard/verifications/actions";
import { cn, formatDate, initials } from "@/lib/utils";

const STATUS_STYLES: Record<VerificationStatus, string> = {
  Pending: "bg-status-pending-bg text-status-pending",
  Verified: "bg-status-open-bg text-status-open",
  Rejected: "bg-status-closed-bg text-status-closed",
};

export function VerificationsView({
  records,
}: {
  records: LawyerVerification[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(id: string, status: "Verified" | "Rejected") {
    const rec = records.find((r) => r.id === id);
    startTransition(async () => {
      const res = await setVerification(id, status);
      if (!res.ok) {
        toast.error("Could not update", { description: res.error });
        return;
      }
      if (status === "Verified") {
        toast.success("Practitioner verified", {
          description: `${rec?.name} can now file and appear on matters.`,
        });
      } else {
        toast.error("Application rejected", {
          description: `${rec?.name} has been notified.`,
        });
      }
      router.refresh();
    });
  }

  const groups: { value: VerificationStatus; label: string }[] = [
    { value: "Pending", label: "Pending" },
    { value: "Verified", label: "Verified" },
    { value: "Rejected", label: "Rejected" },
  ];

  return (
    <Tabs defaultValue="Pending" className="space-y-4">
      <TabsList>
        {groups.map((g) => (
          <TabsTrigger key={g.value} value={g.value}>
            {g.label}
            <span className="text-muted-foreground ml-1 text-xs">
              {records.filter((r) => r.status === g.value).length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {groups.map((g) => {
        const list = records.filter((r) => r.status === g.value);
        return (
          <TabsContent key={g.value} value={g.value} className="space-y-3">
            {list.length ? (
              list.map((r) => (
                <div
                  key={r.id}
                  className="bg-card rounded-xl border p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-11">
                        <AvatarFallback>{initials(r.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="flex items-center gap-2 font-medium">
                          {r.name}
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-medium",
                              STATUS_STYLES[r.status]
                            )}
                          >
                            {r.status}
                          </span>
                        </p>
                        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <Mail className="size-3" /> {r.email}
                        </p>
                        <div className="text-muted-foreground mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                          <span>
                            <span className="text-foreground font-mono">
                              {r.barNumber}
                            </span>
                          </span>
                          <span>Called {r.yearCalled}</span>
                          <span>{r.firm}</span>
                          <span>{r.state}</span>
                        </div>
                      </div>
                    </div>

                    {r.status === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-status-closed hover:text-status-closed"
                          onClick={() => setStatus(r.id, "Rejected")}
                          disabled={pending}
                        >
                          <X /> Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setStatus(r.id, "Verified")}
                          disabled={pending}
                        >
                          {pending ? <Loader2 className="animate-spin" /> : <Check />} Verify
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="outline" className="rounded-full text-xs">
                        Submitted {formatDate(r.submittedOn)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed p-12 text-center">
                {g.value === "Verified" ? (
                  <ShieldCheck className="text-muted-foreground mx-auto size-8" />
                ) : (
                  <ShieldX className="text-muted-foreground mx-auto size-8" />
                )}
                <h3 className="mt-3 font-semibold">Nothing here</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  No {g.label.toLowerCase()} applications right now.
                </p>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
