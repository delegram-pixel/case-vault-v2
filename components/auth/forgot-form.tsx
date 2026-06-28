"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    setLoading(true);
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div>
        <div className="bg-secondary text-secondary-foreground grid size-12 place-items-center rounded-xl">
          <MailCheck className="size-6" />
        </div>
        <h1 className="font-serif mt-5 text-2xl font-bold tracking-tight">
          Check your inbox
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          If an account exists for that email, we&apos;ve sent a link to reset
          your password. It expires in one hour.
        </p>
        <p className="text-muted-foreground bg-secondary/50 mt-4 rounded-lg border p-3 text-xs">
          Demo note: email is stubbed — the reset link is written to the server
          console and the <code className="font-mono">Notification</code> table.
        </p>
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link href="/login">
            <ArrowLeft /> Back to sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-1.5">
        <h1 className="font-serif text-2xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@court.gov.ng"
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Remembered it?{" "}
        <Link
          href="/login"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
