"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  FileText,
  Gavel,
  ScrollText,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AuditEntry } from "@/lib/queries";
import { formatDateTime, initials } from "@/lib/utils";

const ACTION_META: Record<
  string,
  { label: string; icon: LucideIcon; tone: string }
> = {
  "case.create": { label: "Case filed", icon: FileText, tone: "text-status-open" },
  "case.status": { label: "Status changed", icon: FileText, tone: "text-status-pending" },
  "case.update": { label: "Case edited", icon: FileText, tone: "" },
  "document.delete": { label: "Document removed", icon: Trash2, tone: "text-status-closed" },
  "hearing.schedule": { label: "Hearing scheduled", icon: CalendarClock, tone: "text-status-open" },
  "hearing.status": { label: "Hearing updated", icon: CalendarClock, tone: "text-status-pending" },
  "verification.verify": { label: "Attorney verified", icon: ShieldCheck, tone: "text-status-open" },
  "verification.reject": { label: "Attorney rejected", icon: ShieldCheck, tone: "text-status-closed" },
  "user.create": { label: "User created", icon: UserCog, tone: "" },
  "profile.update": { label: "Profile updated", icon: UserCog, tone: "" },
};

function meta(action: string) {
  return (
    ACTION_META[action] ?? { label: action, icon: Gavel, tone: "" }
  );
}

export function AuditView({ entries }: { entries: AuditEntry[] }) {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("all");

  const actions = useMemo(
    () => Array.from(new Set(entries.map((e) => e.action))),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (action !== "all" && e.action !== action) return false;
      if (!q) return true;
      return (
        e.actorName.toLowerCase().includes(q) ||
        (e.target ?? "").toLowerCase().includes(q) ||
        (e.detail ?? "").toLowerCase().includes(q) ||
        meta(e.action).label.toLowerCase().includes(q)
      );
    });
  }, [entries, query, action]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, target or detail…"
            className="pl-9"
          />
        </div>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {actions.map((a) => (
              <SelectItem key={a} value={a}>
                {meta(a).label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        {filtered.length ? (
          <ul className="divide-y">
            {filtered.map((e) => {
              const m = meta(e.action);
              return (
                <li key={e.id} className="flex items-start gap-3 p-4">
                  <div className="bg-secondary grid size-9 shrink-0 place-items-center rounded-lg">
                    <m.icon className={`size-4 ${m.tone}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{m.label}</span>
                      {e.target && (
                        <>
                          {" — "}
                          <span className="font-mono text-xs">{e.target}</span>
                        </>
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {e.detail ? `${e.detail} · ` : ""}
                      {formatDateTime(e.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden text-right sm:block">
                      <span className="block text-xs font-medium">{e.actorName}</span>
                      {e.actorRole && (
                        <Badge variant="secondary" className="rounded-full text-[10px]">
                          {e.actorRole}
                        </Badge>
                      )}
                    </span>
                    <Avatar className="size-8">
                      <AvatarFallback>{initials(e.actorName)}</AvatarFallback>
                    </Avatar>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-12 text-center">
            <ScrollText className="text-muted-foreground mx-auto size-8" />
            <h3 className="mt-3 font-semibold">No audit events</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Privileged actions will appear here as they happen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
