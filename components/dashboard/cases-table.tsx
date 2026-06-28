"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import type { CaseRecord, CaseStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type SortKey = "caseNumber" | "title" | "status" | "filingDate";

export function CasesTable({ cases }: { cases: CaseRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CaseStatus | "all">("all");
  const [court, setCourt] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("filingDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const courtTypes = useMemo(
    () => Array.from(new Set(cases.map((c) => c.courtType))),
    [cases]
  );

  const rows = useMemo(() => {
    let data = [...cases];
    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (c) =>
          c.caseNumber.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.judge.toLowerCase().includes(q) ||
          c.parties.some((p) => p.name.toLowerCase().includes(q))
      );
    }
    if (status !== "all") data = data.filter((c) => c.status === status);
    if (court !== "all") data = data.filter((c) => c.courtType === court);

    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "filingDate") {
        cmp = a.filingDate.localeCompare(b.filingDate);
      } else {
        cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [cases, query, status, court, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const activeFilters = (status !== "all" ? 1 : 0) + (court !== "all" ? 1 : 0);

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case number, title, party or judge…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v as CaseStatus | "all")}>
            <SelectTrigger className="w-[130px]">
              <Filter className="size-3.5" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={court} onValueChange={setCourt}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Court type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courts</SelectItem>
              {courtTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/40 hover:bg-secondary/40">
            <SortHead label="Case number" col="caseNumber" {...{ sortKey, sortDir, toggleSort }} />
            <SortHead label="Title" col="title" {...{ sortKey, sortDir, toggleSort }} />
            <TableHead>Court</TableHead>
            <SortHead label="Status" col="status" {...{ sortKey, sortDir, toggleSort }} />
            <SortHead label="Filed" col="filingDate" className="text-right" {...{ sortKey, sortDir, toggleSort }} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c) => (
            <CaseRow key={c.id} c={c} />
          ))}
        </TableBody>
      </Table>

      {rows.length === 0 && (
        <div className="p-12 text-center">
          <FileSearch className="text-muted-foreground mx-auto size-8" />
          <h3 className="mt-3 font-semibold">No cases match your filters</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Try a different search or clear the filters.
          </p>
        </div>
      )}

      <div className="text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-xs">
        <span>
          Showing {rows.length} of {cases.length} cases
          {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? "s" : ""} active`}
        </span>
      </div>
    </div>
  );
}

function CaseRow({ c }: { c: CaseRecord }) {
  return (
    <TableRow className="group cursor-pointer">
      <TableCell className="font-mono text-xs">
        <Link href={`/dashboard/cases/${c.id}`} className="block">
          {c.caseNumber}
        </Link>
      </TableCell>
      <TableCell className="max-w-[260px]">
        <Link href={`/dashboard/cases/${c.id}`} className="block">
          <span className="block truncate font-medium group-hover:underline">
            {c.title}
          </span>
          <span className="text-muted-foreground block truncate text-xs">
            {c.parties.length} parties · {c.judge}
          </span>
        </Link>
      </TableCell>
      <TableCell>
        <Link href={`/dashboard/cases/${c.id}`} className="block text-sm">
          <span className="block">{c.courtType}</span>
          <span className="text-muted-foreground block text-xs">{c.courtState}</span>
        </Link>
      </TableCell>
      <TableCell>
        <Link href={`/dashboard/cases/${c.id}`} className="block">
          <StatusBadge status={c.status} />
        </Link>
      </TableCell>
      <TableCell className="text-right text-sm whitespace-nowrap">
        <Link href={`/dashboard/cases/${c.id}`} className="block">
          {formatDate(c.filingDate)}
        </Link>
      </TableCell>
    </TableRow>
  );
}

function SortHead({
  label,
  col,
  sortKey,
  sortDir,
  toggleSort,
  className,
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  toggleSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === col;
  return (
    <TableHead className={className}>
      <button
        onClick={() => toggleSort(col)}
        className={cn(
          "hover:text-foreground inline-flex items-center gap-1 transition-colors",
          active && "text-foreground",
          className?.includes("text-right") && "flex-row-reverse"
        )}
      >
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )
        ) : (
          <ArrowUpDown className="size-3 opacity-50" />
        )}
      </button>
    </TableHead>
  );
}
