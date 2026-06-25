import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CloudUpload,
  FileCheck2,
  Gavel,
  ListChecks,
  MapPin,
  ShieldCheck,
  Smartphone,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicCaseSearch } from "@/components/public-case-search";
import { COURT_TYPES } from "@/lib/nigeria";

const STATS = [
  { value: "36+1", label: "States & the FCT covered" },
  { value: "6", label: "State & federal court types" },
  { value: "100%", label: "Paperless filing" },
  { value: "24/7", label: "Public case search" },
];

const FEATURES = [
  {
    icon: FileCheck2,
    title: "Validated case filing",
    body: "Capture parties, attorneys, and documents through guided forms that catch errors before they reach the registry.",
  },
  {
    icon: CalendarClock,
    title: "Conflict-aware scheduling",
    body: "Schedule hearings with automatic room and judge conflict detection, plus email and SMS reminders.",
  },
  {
    icon: ListChecks,
    title: "Living docket",
    body: "Every filing and order recorded in a chronological, tamper-evident docket for each case.",
  },
  {
    icon: CloudUpload,
    title: "Cloud document vault",
    body: "Court records stored securely off-site, so filings survive fire, flood, and the passage of time.",
  },
  {
    icon: ShieldCheck,
    title: "Server-side access control",
    body: "Role-based permissions enforced on the server — clerks, judges, attorneys, and admins see only what they should.",
  },
  {
    icon: UserCheck,
    title: "Verified practitioners",
    body: "Attorneys are verified against bar credentials before they can file or appear on a matter.",
  },
];

const ROLES = [
  { icon: FileCheck2, role: "Court Clerk", body: "File cases, manage parties, update status, print records." },
  { icon: Gavel, role: "Judge", body: "Review case details, dockets, schedules, and enter rulings." },
  { icon: Building2, role: "Attorney", body: "Track matters, view documents, watch hearing dates." },
  { icon: ShieldCheck, role: "Admin", body: "Manage users, verify credentials, configure the system." },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="bg-grid mask-fade-b absolute inset-0 -z-10 opacity-60" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="bg-background mb-5 gap-1.5 rounded-full py-1 pl-1.5"
            >
              <span className="bg-status-open size-1.5 rounded-full" />
              Now serving state-level courts nationwide
            </Badge>
            <h1 className="font-serif text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-6xl">
              The case file, finally out of the filing cabinet.
            </h1>
            <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg text-pretty">
              Case Vault is a paperless court records system for Nigerian state
              courts. File and track cases, manage dockets and hearings, and let
              the public search any case — no login required.
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <PublicCaseSearch size="lg" />
              <p className="text-muted-foreground mt-2 text-xs">
                Try a sample number like{" "}
                <Link
                  href="/search?q=LD/2451/2026"
                  className="text-foreground font-medium underline-offset-4 hover:underline"
                >
                  LD/2451/2026
                </Link>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/find">
                  <MapPin /> Find a court
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">
                  Create an account <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-2 py-8 text-center md:py-10">
              <div className="font-serif text-3xl font-bold sm:text-4xl">
                {s.value}
              </div>
              <div className="text-muted-foreground mt-1 text-sm text-balance">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            Built for the registry
          </p>
          <h2 className="font-serif mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a modern court registry needs
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Designed around how state courts actually work — from first filing to
            final judgment.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card group p-6">
              <div className="bg-secondary text-secondary-foreground grid size-10 place-items-center rounded-lg transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="border-y bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                One system, every role
              </h2>
              <p className="text-muted-foreground mt-3 text-lg">
                Tailored dashboards for everyone who touches a case — and an open
                portal for the public.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/register">
                Choose your role <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r) => (
              <div key={r.role} className="bg-card rounded-xl border p-5">
                <r.icon className="size-5" />
                <h3 className="mt-3 font-semibold">{r.role}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Court types */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Find courts by type and state
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            A four-step finder takes the public from court type to exact branch —
            with address, phone, hours, and directions.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURT_TYPES.map((c) => (
            <Link
              key={c.type}
              href="/find"
              className="bg-card hover:border-foreground/30 group flex items-start justify-between gap-4 rounded-xl border p-5 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{c.type}</h3>
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    {c.jurisdiction}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1.5 text-sm">{c.blurb}</p>
              </div>
              <ArrowRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12">
          <div className="relative mx-auto max-w-2xl">
            <Smartphone className="mx-auto size-8 opacity-80" />
            <h2 className="font-serif mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Mobile-first. Offline-aware. Disaster-proof.
            </h2>
            <p className="mt-3 text-base opacity-80">
              Whether you are a clerk at the registry counter or a litigant
              checking a hearing date from your phone, Case Vault works wherever
              you are.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register">Get started free</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/find">Search a court</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
