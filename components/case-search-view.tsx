"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarClock,
  FileSearch,
  Gavel,
  Landmark,
  ListChecks,
  Loader2,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import {
  searchPublicCases,
  type PublicCaseResult,
} from "@/app/(public)/search/actions";
import type { CaseStatus } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

export function CaseSearchView() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const [results, setResults] = useState<PublicCaseResult[]>([]);
  const [searching, startSearch] = useTransition();

  function runSearch(q: string) {
    setSubmitted(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    startSearch(async () => {
      setResults(await searchPublicCases(q));
    });
  }

  // Run once for a query arriving via ?q=
  useEffect(() => {
    if (initial.trim()) runSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
        className="bg-card flex items-center gap-2 rounded-xl border p-2 shadow-sm"
      >
        <Search className="text-muted-foreground ml-2 size-5 shrink-0" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Case number or title…"
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button type="submit" disabled={searching}>
          {searching && <Loader2 className="animate-spin" />} Search
        </Button>
      </form>

      {/* Empty initial */}
      {!submitted.trim() && (
        <div className="mt-10 rounded-xl border border-dashed p-12 text-center">
          <FileSearch className="text-muted-foreground mx-auto size-8" />
          <h3 className="mt-3 font-semibold">Start with a case number</h3>
          <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
            Enter a number above. Sample records:{" "}
            <button
              className="text-foreground font-medium underline-offset-4 hover:underline"
              onClick={() => {
                setQuery("LD/2451/2026");
                runSearch("LD/2451/2026");
              }}
            >
              LD/2451/2026
            </button>
            ,{" "}
            <button
              className="text-foreground font-medium underline-offset-4 hover:underline"
              onClick={() => {
                setQuery("ABJ/0912/2026");
                runSearch("ABJ/0912/2026");
              }}
            >
              ABJ/0912/2026
            </button>
          </p>
        </div>
      )}

      {/* No results */}
      {submitted.trim() && results.length === 0 && !searching && (
        <div className="mt-10 rounded-xl border border-dashed p-12 text-center">
          <FileSearch className="text-muted-foreground mx-auto size-8" />
          <h3 className="mt-3 font-semibold">No matching case</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            We couldn&apos;t find a case for “{submitted}”. Check the number and
            try again.
          </p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            {results.length} result{results.length === 1 ? "" : "s"} for “
            {submitted}”
          </p>
          {results.map((c) => {
            const nextHearing = c.nextHearing;
            const latest = c.latestDocket;
            return (
              <article
                key={c.id}
                className="bg-card overflow-hidden rounded-xl border shadow-sm"
              >
                <div className="border-b p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-muted-foreground font-mono text-xs">
                        {c.caseNumber}
                      </p>
                      <h2 className="font-serif mt-1 text-xl font-bold tracking-tight">
                        {c.title}
                      </h2>
                    </div>
                    <StatusBadge status={c.status as CaseStatus} />
                  </div>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <dl className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                  <Field icon={Landmark} label="Court">
                    {c.courtType}
                  </Field>
                  <Field icon={MapPin} label="State">
                    {c.courtState}
                  </Field>
                  <Field icon={Gavel} label="Presiding">
                    {c.judge}
                  </Field>
                  <Field icon={CalendarClock} label="Filed">
                    {formatDate(c.filingDate)}
                  </Field>
                </dl>

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div>
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                      <Users className="size-3.5" /> Parties
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {c.parties.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{p.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {p.role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                        <CalendarClock className="size-3.5" /> Next hearing
                      </h3>
                      {nextHearing ? (
                        <p className="text-muted-foreground mt-2 text-sm">
                          {nextHearing.eventType} —{" "}
                          <span className="text-foreground font-medium">
                            {formatDateTime(nextHearing.dateTime)}
                          </span>
                          , {nextHearing.roomNumber}
                        </p>
                      ) : (
                        <p className="text-muted-foreground mt-2 text-sm">
                          No upcoming hearing scheduled.
                        </p>
                      )}
                    </div>
                    <Separator />
                    <div>
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                        <ListChecks className="size-3.5" /> Latest docket entry
                      </h3>
                      {latest && (
                        <p className="text-muted-foreground mt-2 text-sm">
                          <span className="text-foreground">
                            {formatDate(latest.filingDate)}
                          </span>{" "}
                          — {latest.docketText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card p-4">
      <dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{children}</dd>
    </div>
  );
}
