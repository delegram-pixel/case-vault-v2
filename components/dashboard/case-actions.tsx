"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Loader2, MoreHorizontal, Pencil, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";
import { updateCaseDetails, updateCaseStatus } from "@/app/dashboard/cases/actions";
import { CASE_STATUSES } from "@/lib/validations";
import type { CaseStatus } from "@/lib/types";

export function CaseActions({
  caseId,
  caseNumber,
  status,
  title,
  description,
  canEdit = false,
  canStatus = false,
}: {
  caseId: string;
  caseNumber: string;
  status: CaseStatus;
  title: string;
  description: string;
  canEdit?: boolean;
  canStatus?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changeStatus(next: string) {
    if (next === status) return;
    startTransition(async () => {
      const res = await updateCaseStatus(caseId, next);
      if (res.ok) {
        toast.success("Status updated", { description: `${caseNumber} is now ${next}.` });
        router.refresh();
      } else {
        toast.error("Could not update status", { description: res.error });
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          toast.success("Preparing record", {
            description: `${caseNumber} sent to the print queue.`,
          });
          setTimeout(() => window.print(), 400);
        }}
      >
        <Printer /> Print record
      </Button>

      {canEdit && (
        <EditCaseDialog
          caseId={caseId}
          title={title}
          description={description}
        />
      )}

      {canStatus && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              Update status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Set status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CASE_STATUSES.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => changeStatus(s)}
                className="justify-between"
              >
                <StatusBadge status={s} />
                {s === status && <Check className="size-3.5" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More actions">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toast.success("Link copied")}>
            <Share2 /> Share case
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function EditCaseDialog({
  caseId,
  title,
  description,
}: {
  caseId: string;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [t, setT] = useState(title);
  const [d, setD] = useState(description);
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      const res = await updateCaseDetails(caseId, { title: t, description: d });
      if (res.ok) {
        toast.success("Case updated");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Could not update", { description: res.error });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit case details</DialogTitle>
          <DialogDescription>
            Update the title and description for this matter.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" value={t} onChange={(e) => setT(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              rows={4}
              value={d}
              onChange={(e) => setD(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
