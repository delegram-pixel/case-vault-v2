"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, Users } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL_PARTIES, ALL_ATTORNEYS } from "@/lib/aggregates";
import { initials } from "@/lib/utils";

const ROLES = ["Plaintiff", "Defendant", "Witness", "Other"];

export function PartiesView() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  const parties = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PARTIES.filter((p) => {
      if (role !== "all" && p.role !== role) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.caseNumber.toLowerCase().includes(q)
      );
    });
  }, [query, role]);

  const attorneys = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ATTORNEYS;
    return ALL_ATTORNEYS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.firm.toLowerCase().includes(q) ||
        a.caseNumber.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Tabs defaultValue="parties" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList>
          <TabsTrigger value="parties">
            <Users className="size-3.5" /> Parties
            <span className="text-muted-foreground ml-0.5 text-xs">
              {ALL_PARTIES.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="attorneys">
            <ShieldCheck className="size-3.5" /> Attorneys
            <span className="text-muted-foreground ml-0.5 text-xs">
              {ALL_ATTORNEYS.length}
            </span>
          </TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, firm or case…"
              className="pl-9 sm:w-72"
            />
          </div>
        </div>
      </div>

      <TabsContent value="parties" className="space-y-4">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {parties.map((p) => (
            <Link
              key={`${p.caseId}-${p.id}`}
              href={`/dashboard/cases/${p.caseId}`}
              className="bg-card hover:border-foreground/30 flex items-center gap-3 rounded-xl border p-4 shadow-sm transition-colors"
            >
              <Avatar>
                <AvatarFallback>{initials(p.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {p.caseNumber} · {p.courtState}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {p.role}
              </Badge>
            </Link>
          ))}
          {parties.length === 0 && (
            <p className="text-muted-foreground col-span-full rounded-xl border border-dashed p-10 text-center text-sm">
              No parties match your search.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="attorneys">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {attorneys.map((a) => (
            <Link
              key={`${a.caseId}-${a.id}`}
              href={`/dashboard/cases/${a.caseId}`}
              className="bg-card hover:border-foreground/30 rounded-xl border p-4 shadow-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{initials(a.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                    {a.name}
                    <ShieldCheck className="text-status-open size-3.5 shrink-0" />
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {a.firm}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground mt-3 flex items-center justify-between border-t pt-3 text-xs">
                <span className="font-mono">{a.barNumber}</span>
                <Badge variant="outline" className="rounded-full">
                  for {a.representing}
                </Badge>
              </div>
            </Link>
          ))}
          {attorneys.length === 0 && (
            <p className="text-muted-foreground col-span-full rounded-xl border border-dashed p-10 text-center text-sm">
              No attorneys match your search.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
