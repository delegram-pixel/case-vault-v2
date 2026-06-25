import Link from "next/link";
import { Logo } from "@/components/logo";

const LINKS = [
  {
    heading: "Platform",
    items: [
      { href: "/find", label: "Find a Court" },
      { href: "/search", label: "Case Search" },
      { href: "/register", label: "Register" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    heading: "Courts",
    items: [
      { href: "/find", label: "High Courts" },
      { href: "/find", label: "Magistrate Courts" },
      { href: "/find", label: "Customary Courts" },
      { href: "/find", label: "Sharia Courts" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
      { href: "#", label: "Accessibility" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="text-muted-foreground max-w-xs text-sm">
            A paperless case management system for Nigerian state courts. Built
            for clerks, judges, attorneys — and the public.
          </p>
        </div>
        {LINKS.map((col) => (
          <div key={col.heading}>
            <h3 className="text-sm font-semibold">{col.heading}</h3>
            <ul className="mt-3 space-y-2">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Case Vault. A demonstration system.</p>
          <p>Serving all 36 states & the FCT.</p>
        </div>
      </div>
    </footer>
  );
}
