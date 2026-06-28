"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Building2, FileCheck2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

// Judge and Admin accounts are provisioned by an administrator, not self-served.
const ROLES: { value: Role; label: string; icon: React.ElementType; hint: string }[] =
  [
    { value: "CLERK", label: "Court Clerk", icon: FileCheck2, hint: "File & manage cases" },
    { value: "ATTORNEY", label: "Attorney", icon: Building2, hint: "Track matters" },
  ];

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CLERK");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";

    const payload = {
      name: get("name"),
      email: get("email"),
      password: get("password"),
      role,
      barNumber: get("bar") || undefined,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Could not create account", { description: data.error });
        setLoading(false);
        return;
      }

      if (data.pendingVerification) {
        toast.success("Account created", {
          description: "Your bar credentials are pending admin verification.",
        });
      } else {
        toast.success("Account created", { description: "Welcome to Case Vault." });
      }

      await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-1.5">
        <h1 className="font-serif text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose your role to get the right dashboard.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <div className="space-y-2">
          <Label>I am a…</Label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => {
              const active = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                    active
                      ? "border-foreground bg-secondary"
                      : "hover:border-foreground/30"
                  )}
                >
                  <r.icon className="size-4" />
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-muted-foreground text-xs">{r.hint}</span>
                </button>
              );
            })}
          </div>
          <p className="text-muted-foreground text-xs">
            Judge and admin accounts are provisioned by an administrator.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required placeholder="Barr. Funke Adebayo" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@court.gov.ng"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="At least 8 characters"
            />
          </div>
        </div>

        {role === "ATTORNEY" && (
          <div className="bg-secondary/50 space-y-2 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-status-open size-4" />
              <Label htmlFor="bar" className="m-0">
                Bar / Supreme Court enrolment number
              </Label>
            </div>
            <Input
              id="bar"
              required
              placeholder="SCN/000000"
              className="bg-background font-mono"
            />
            <p className="text-muted-foreground text-xs">
              We verify practitioners against the roll before filing access is
              granted.
            </p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already registered?{" "}
        <Link
          href="/login"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
