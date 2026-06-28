"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { MAIN_NAV, MODULE_NAV, ADMIN_NAV, type NavItem } from "@/components/dashboard/nav";
import { cn } from "@/lib/utils";

const WORKSPACE: Record<string, string> = {
  CLERK: "Clerk workspace",
  JUDGE: "Judge's chambers",
  ATTORNEY: "Attorney workspace",
  ADMIN: "Administration",
};

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active =
    !item.soon &&
    (item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href));

  if (item.soon) {
    return (
      <span className="text-muted-foreground/70 flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm">
        <item.icon className="size-4" />
        <span className="flex-1">{item.label}</span>
        <Badge variant="secondary" className="rounded-full text-[10px]">
          Soon
        </Badge>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      )}
    >
      <item.icon className="size-4" />
      {item.label}
    </Link>
  );
}

function Section({ title, items, onNavigate }: { title: string; items: NavItem[]; onNavigate?: () => void }) {
  return (
    <div>
      <p className="text-muted-foreground/70 px-3 pt-4 pb-1.5 text-[11px] font-semibold tracking-wider uppercase">
        {title}
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const workspace = role ? WORKSPACE[role] ?? "Workspace" : "Workspace";

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-5">
        <Logo href="/dashboard" />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <Section title="Registry" items={MAIN_NAV} onNavigate={onNavigate} />
        <Section title="Modules" items={MODULE_NAV} onNavigate={onNavigate} />
        <Section
          title="Administration"
          items={ADMIN_NAV.filter((i) => !i.adminOnly || role === "ADMIN")}
          onNavigate={onNavigate}
        />
      </div>
      <div className="border-t p-3">
        <div className="bg-secondary/60 rounded-lg p-3">
          <p className="text-sm font-medium">{workspace}</p>
          <p className="text-muted-foreground text-xs">
            {session?.user?.email ?? "Case Vault"}
          </p>
        </div>
      </div>
    </div>
  );
}
