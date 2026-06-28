"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileText, Search, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DocumentWithCase } from "@/lib/aggregates";
import { formatDate } from "@/lib/utils";

export function DocumentsView({ documents }: { documents: DocumentWithCase[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const types = useMemo(
    () => Array.from(new Set(documents.map((d) => d.type))),
    [documents]
  );

  const docs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((d) => {
      if (type !== "all" && d.type !== type) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.caseNumber.toLowerCase().includes(q) ||
        d.caseTitle.toLowerCase().includes(q)
      );
    });
  }, [documents, query, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents or case number…"
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="sm:w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => toast.success("Upload ready", { description: "Drag files or pick from device (demo)." })}>
          <UploadCloud /> Upload
        </Button>
      </div>

      {docs.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <div
              key={d.id}
              className="bg-card group flex flex-col rounded-xl border p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="bg-secondary grid size-10 place-items-center rounded-lg">
                  <FileText className="size-5" />
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {d.type}
                </Badge>
              </div>
              <p className="mt-3 truncate text-sm font-medium" title={d.name}>
                {d.name}
              </p>
              <Link
                href={`/dashboard/cases/${d.caseId}`}
                className="text-muted-foreground hover:text-foreground mt-0.5 truncate text-xs"
              >
                {d.caseNumber} — {d.caseTitle}
              </Link>
              <div className="text-muted-foreground mt-3 flex items-center justify-between border-t pt-3 text-xs">
                <span>
                  {d.size} · {formatDate(d.uploadDate)}
                </span>
                {d.url && d.url !== "#" ? (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Download className="size-3.5" /> Download
                  </a>
                ) : (
                  <button
                    onClick={() => toast.info("Sample record — no file attached.")}
                    className="hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Download className="size-3.5" /> Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <FileText className="text-muted-foreground mx-auto size-8" />
          <h3 className="mt-3 font-semibold">No documents found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Try another search or clear the filter.
          </p>
        </div>
      )}
    </div>
  );
}
