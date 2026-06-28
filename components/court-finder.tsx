"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Search,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { COURT_TYPES, NIGERIAN_STATES } from "@/lib/nigeria";
import type { CourtBranch, CourtType } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Court type", "State", "Action", "Results"];

export function CourtFinder({ courts }: { courts: CourtBranch[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [courtType, setCourtType] = useState<CourtType | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [mode, setMode] = useState<"browse" | "search" | null>(null);
  const [stateQuery, setStateQuery] = useState("");
  const [caseQuery, setCaseQuery] = useState("");

  const filteredStates = useMemo(
    () =>
      NIGERIAN_STATES.filter((s) =>
        s.toLowerCase().includes(stateQuery.toLowerCase())
      ),
    [stateQuery]
  );

  const branches = useMemo(
    () => courts.filter((c) => c.type === courtType && c.state === state),
    [courts, courtType, state]
  );

  const canNext =
    (step === 0 && courtType) ||
    (step === 1 && state) ||
    (step === 2 && mode) ||
    step === 3;

  function next() {
    if (step === 2 && mode === "search") {
      // jump straight to public case search
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
      {/* Stepper */}
      <div className="border-b p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-sm font-medium">{STEPS[step]}</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-3" />
        <ol className="mt-4 hidden grid-cols-4 gap-2 sm:grid">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 text-sm",
                i <= step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                  i < step && "bg-primary text-primary-foreground border-primary",
                  i === step && "border-foreground",
                  i > step && "text-muted-foreground"
                )}
              >
                {i < step ? <Check className="size-3" /> : i + 1}
              </span>
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-5 sm:p-6">
        {/* Step 1 — court type */}
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {COURT_TYPES.map((c) => {
              const active = courtType === c.type;
              return (
                <button
                  key={c.type}
                  onClick={() => setCourtType(c.type)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                    active
                      ? "border-foreground bg-secondary"
                      : "hover:border-foreground/30"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-lg",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    <Building2 className="size-4" />
                  </span>
                  <span>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{c.type}</span>
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px]"
                      >
                        {c.jurisdiction}
                      </Badge>
                    </span>
                    <span className="text-muted-foreground mt-0.5 block text-sm">
                      {c.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2 — state */}
        {step === 1 && (
          <div>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={stateQuery}
                onChange={(e) => setStateQuery(e.target.value)}
                placeholder="Search states…"
                className="pl-9"
              />
            </div>
            <div className="mt-4 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
              {filteredStates.map((s) => (
                <button
                  key={s}
                  onClick={() => setState(s)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    state === s
                      ? "border-foreground bg-secondary font-medium"
                      : "hover:border-foreground/30"
                  )}
                >
                  {s}
                </button>
              ))}
              {filteredStates.length === 0 && (
                <p className="text-muted-foreground col-span-full py-6 text-center text-sm">
                  No states match “{stateQuery}”.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — action */}
        {step === 2 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setMode("browse")}
              className={cn(
                "rounded-xl border p-5 text-left transition-colors",
                mode === "browse"
                  ? "border-foreground bg-secondary"
                  : "hover:border-foreground/30"
              )}
            >
              <Building2 className="size-5" />
              <h3 className="mt-3 font-semibold">Browse courts</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                See {courtType} branches in {state} with address, phone, hours and
                directions.
              </p>
            </button>
            <button
              onClick={() => setMode("search")}
              className={cn(
                "rounded-xl border p-5 text-left transition-colors",
                mode === "search"
                  ? "border-foreground bg-secondary"
                  : "hover:border-foreground/30"
              )}
            >
              <Search className="size-5" />
              <h3 className="mt-3 font-semibold">Search a case by ID</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Already have a case number? Look it up directly in the public
                registry.
              </p>
            </button>

            {mode === "search" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(
                    caseQuery.trim()
                      ? `/search?q=${encodeURIComponent(caseQuery.trim())}`
                      : "/search"
                  );
                }}
                className="bg-secondary/50 flex flex-col gap-2 rounded-xl border p-4 sm:col-span-2 sm:flex-row"
              >
                <Input
                  autoFocus
                  value={caseQuery}
                  onChange={(e) => setCaseQuery(e.target.value)}
                  placeholder="Enter case number, e.g. LD/2451/2026"
                  className="bg-background"
                />
                <Button type="submit">
                  <Search /> Search registry
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Step 4 — results (browse) */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {courtType}
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                {state}
              </Badge>
              <span className="text-muted-foreground text-sm">
                {branches.length} branch{branches.length === 1 ? "" : "es"} found
              </span>
            </div>

            {branches.length > 0 ? (
              <div className="space-y-3">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl border p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{b.name}</h3>
                        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                          <MapPin className="size-3.5 shrink-0" />
                          {b.address}
                        </p>
                      </div>
                      <span className="bg-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium">
                        <Star className="fill-status-pending text-status-pending size-3.5" />
                        {b.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <p className="flex items-center gap-1.5">
                        <Phone className="size-3.5 shrink-0" />
                        {b.phone}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="size-3.5 shrink-0" />
                        {b.hours}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            b.name + " " + b.address
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Navigation /> Directions
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <a href={`tel:${b.phone.replace(/\s/g, "")}`}>
                          <Phone /> Call
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-10 text-center">
                <Building2 className="text-muted-foreground mx-auto size-8" />
                <h3 className="mt-3 font-semibold">No branches indexed yet</h3>
                <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
                  We don&apos;t have {courtType} branches listed for {state} in
                  this demo dataset. Try Lagos or FCT — Abuja, which are fully
                  indexed.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setStep(1);
                    setState(null);
                  }}
                >
                  Pick another state
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-2 border-t p-5 sm:p-6">
        <Button
          variant="ghost"
          onClick={back}
          disabled={step === 0}
          className={cn(step === 0 && "invisible")}
        >
          <ArrowLeft /> Back
        </Button>
        {step < 3 ? (
          <Button onClick={next} disabled={!canNext || (step === 2 && mode === "search")}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/search">Search a different case</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
