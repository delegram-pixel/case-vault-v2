"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement)
      .value;

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Could not reset password", { description: data.error });
        setLoading(false);
        return;
      }
      toast.success("Password updated", {
        description: "You can now sign in with your new password.",
      });
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-1.5">
        <h1 className="font-serif text-2xl font-bold tracking-tight">
          Set a new password
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose a strong password you don&apos;t use elsewhere.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              minLength={8}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type={show ? "text" : "password"}
            required
            minLength={8}
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
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
