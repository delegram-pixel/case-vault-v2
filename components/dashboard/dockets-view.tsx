"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListChecks, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DocketWithCase } from "@/lib/aggregates";
import { formatDate } from "@/lib/utils";

export function DocketsView({ docket }: { docket: DocketWithCase[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const types = useMemo(
    () => Array.from(new Set(docket.map((d) => d.docketType))),
    [docket]
  );

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docket.filter((d) => {
      if (type !== "all" && d.docketType !== type) return false;
      if (!q) return true;
      return (
        d.docketText.toLowerCase().includes(q) ||
        d.caseNumber.toLowerCase().includes(q) ||
        d.filingParty.toLowerCase().includes(q)
      );
    });
  }, [docket, query, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docket text, case or party…"
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="sm:w-[170px]">
            <SelectValue placeholder="Entry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entry types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border p-5 shadow-sm sm:p-6">
        {entries.length ? (
          <ol className="relative space-y-6">
            <span className="bg-border absolute top-1 bottom-1 left-[7px] w-px" />
            {entries.map((e) => (
              <li key={`${e.caseId}-${e.id}`} className="relative pl-7">
                <span className="bg-background ring-border absolute top-1 left-0 size-3.5 rounded-full ring-2">
                  <span className="bg-foreground absolute inset-1 rounded-full" />
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {e.docketType}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(e.filingDate)} · filed by {e.filingParty}
                  </span>
                </div>
                <p className="mt-1.5 text-sm">{e.docketText}</p>
                <Link
                  href={`/dashboard/cases/${e.caseId}`}
                  className="text-muted-foreground hover:text-foreground mt-1 inline-block text-xs"
                >
                  {e.caseNumber} — {e.caseTitle}
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="py-10 text-center">
            <ListChecks className="text-muted-foreground mx-auto size-8" />
            <h3 className="mt-3 font-semibold">No docket entries</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Adjust your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
