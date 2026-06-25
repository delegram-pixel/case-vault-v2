import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="bg-grid absolute inset-0 opacity-[0.07]" />
        <Logo
          href="/"
          className="relative [&_span:first-child]:bg-primary-foreground [&_span:first-child]:text-primary [&>span:last-child]:text-primary-foreground"
        />
        <div className="relative max-w-md">
          <Quote className="size-8 opacity-40" />
          <p className="font-serif mt-4 text-2xl leading-relaxed font-medium text-balance">
            Justice delayed by paperwork is justice denied. Case Vault keeps the
            registry moving.
          </p>
          <p className="mt-4 text-sm opacity-70">
            Built for clerks, judges, attorneys, and the public.
          </p>
        </div>
        <p className="relative text-xs opacity-60">
          © {new Date().getFullYear()} Case Vault · A demonstration system
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <Logo href="/" className="lg:hidden" />
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground ml-auto inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
