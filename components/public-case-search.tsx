"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PublicCaseSearch({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "lg";
}) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "bg-card flex items-center gap-2 rounded-xl border p-2 shadow-sm",
        className
      )}
    >
      <Search className="text-muted-foreground ml-2 size-5 shrink-0" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by case number, e.g. LD/2451/2026"
        className={cn(
          "border-0 bg-transparent shadow-none focus-visible:ring-0",
          size === "lg" && "h-11 text-base"
        )}
      />
      <Button type="submit" size={size === "lg" ? "lg" : "default"}>
        Search
      </Button>
    </form>
  );
}
