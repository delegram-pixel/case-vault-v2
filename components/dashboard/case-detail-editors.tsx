"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  addAttorney,
  addDocketEntry,
  addParty,
  deleteDocument,
  removeAttorney,
  removeParty,
} from "@/app/dashboard/cases/actions";
import { DOCKET_TYPES, PARTY_ROLES } from "@/lib/validations";

function useRefresh() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return { pending, refresh: () => start(() => router.refresh()) };
}

export function RemoveItemButton({
  caseId,
  id,
  kind,
}: {
  caseId: string;
  id: string;
  kind: "party" | "attorney";
}) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive size-8"
      aria-label={`Remove ${kind}`}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res =
            kind === "party"
              ? await removeParty(caseId, id)
              : await removeAttorney(caseId, id);
          if (res.ok) toast.success(`${kind === "party" ? "Party" : "Attorney"} removed`);
          else toast.error("Could not remove", { description: res.error });
        })
      }
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  );
}

export function DeleteDocumentButton({
  caseId,
  documentId,
}: {
  caseId: string;
  documentId: string;
}) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive size-8"
      aria-label="Delete document"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await deleteDocument(caseId, documentId);
          if (res.ok) toast.success("Document deleted");
          else toast.error("Could not delete", { description: res.error });
        })
      }
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  );
}

export function AddPartyDialog({ caseId }: { caseId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<(typeof PARTY_ROLES)[number]>("Defendant");
  const [pending, start] = useTransition();

  function submit() {
    start(async () => {
      const res = await addParty(caseId, { name, role });
      if (res.ok) {
        toast.success("Party added");
        setName("");
        setRole("Defendant");
        setOpen(false);
      } else {
        toast.error("Could not add party", { description: res.error });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus /> Add party
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a party</DialogTitle>
          <DialogDescription>Record a new party to this case.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="party-name">Name</Label>
            <Input
              id="party-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name or organisation"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARTY_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Add party
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddAttorneyDialog({ caseId }: { caseId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [firm, setFirm] = useState("");
  const [representing, setRepresenting] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    start(async () => {
      const res = await addAttorney(caseId, { name, firm, representing });
      if (res.ok) {
        toast.success("Attorney added");
        setName("");
        setFirm("");
        setRepresenting("");
        setOpen(false);
      } else {
        toast.error("Could not add attorney", { description: res.error });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus /> Add attorney
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an attorney</DialogTitle>
          <DialogDescription>Counsel on record for this matter.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="att-name">Name</Label>
            <Input id="att-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Barr. Jane Doe" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="att-firm">Firm (optional)</Label>
            <Input id="att-firm" value={firm} onChange={(e) => setFirm(e.target.value)} placeholder="Doe & Co." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="att-rep">Representing</Label>
            <Input id="att-rep" value={representing} onChange={(e) => setRepresenting(e.target.value)} placeholder="Plaintiff" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Add attorney
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddDocketDialog({
  caseId,
  filingParty,
}: {
  caseId: string;
  filingParty: string;
}) {
  const [open, setOpen] = useState(false);
  const [docketType, setDocketType] =
    useState<(typeof DOCKET_TYPES)[number]>("Note");
  const [docketText, setDocketText] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    start(async () => {
      const res = await addDocketEntry(caseId, {
        docketType,
        docketText,
        filingParty,
      });
      if (res.ok) {
        toast.success("Docket entry added");
        setDocketText("");
        setDocketType("Note");
        setOpen(false);
      } else {
        toast.error("Could not add entry", { description: res.error });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus /> Add entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a docket entry</DialogTitle>
          <DialogDescription>
            Record a filing, order or note on the case timeline.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={docketType}
              onValueChange={(v) => setDocketType(v as typeof docketType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCKET_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="docket-text">Entry</Label>
            <Textarea
              id="docket-text"
              rows={3}
              value={docketText}
              onChange={(e) => setDocketText(e.target.value)}
              placeholder="Describe the filing or action…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Add entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
