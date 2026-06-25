import Link from "next/link";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-md shadow-sm transition-transform group-hover:scale-105">
        <Scale className="size-4" />
      </span>
      {showText && (
        <span className="font-serif text-lg leading-none font-bold tracking-tight">
          Case&nbsp;Vault
        </span>
      )}
    </Link>
  );
}
