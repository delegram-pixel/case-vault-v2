"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createUser } from "@/app/dashboard/users/actions";
import { ROLES } from "@/lib/validations";
import type { AdminUser } from "@/lib/queries";
import { formatDate, initials } from "@/lib/utils";

type StaffRole = (typeof ROLES)[number];

const ROLE_LABELS: Record<string, string> = {
  CLERK: "Court Clerk",
  JUDGE: "Judge",
  ATTORNEY: "Attorney",
  ADMIN: "Administrator",
};

const STATUS_STYLES: Record<string, string> = {
  Verified: "bg-status-open-bg text-status-open",
  Pending: "bg-status-pending-bg text-status-pending",
  Rejected: "bg-status-closed-bg text-status-closed",
};

export function UsersView({ users }: { users: AdminUser[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        ROLE_LABELS[u.role]?.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or role…"
            className="pl-9"
          />
        </div>
        <CreateUserDialog />
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40 hover:bg-secondary/40">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback>{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-full">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.role === "ATTORNEY" ? (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[u.verificationStatus] ?? ""
                      }`}
                    >
                      {u.verificationStatus}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Active</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm whitespace-nowrap">
                  {formatDate(u.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <p className="text-muted-foreground p-10 text-center text-sm">
            No users match your search.
          </p>
        )}
      </div>
    </div>
  );
}

function CreateUserDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("CLERK");
  const [pending, start] = useTransition();

  function submit() {
    start(async () => {
      const res = await createUser({ name, email, password, role });
      if (res.ok) {
        toast.success("User created", { description: `${name} can now sign in.` });
        setName("");
        setEmail("");
        setPassword("");
        setRole("CLERK");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Could not create user", { description: res.error });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus /> Create user
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a user</DialogTitle>
          <DialogDescription>
            Provision a new registry account, including judges and admins.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="u-name">Full name</Label>
            <Input id="u-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Hon. Justice A. Mohammed" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="u-email">Email</Label>
            <Input id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@court.gov.ng" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as StaffRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-pw">Temp password</Label>
              <Input id="u-pw" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 chars" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />} Create user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
