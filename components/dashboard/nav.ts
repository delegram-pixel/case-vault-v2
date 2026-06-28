import {
  CalendarClock,
  FilePlus2,
  FolderClosed,
  LayoutDashboard,
  ListChecks,
  MapPin,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
  adminOnly?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "File a Case", href: "/dashboard/cases/new", icon: FilePlus2 },
  { label: "Court Finder", href: "/find", icon: MapPin },
];

export const MODULE_NAV: NavItem[] = [
  { label: "Hearings", href: "/dashboard/hearings", icon: CalendarClock },
  { label: "Documents", href: "/dashboard/documents", icon: FolderClosed },
  { label: "Dockets", href: "/dashboard/dockets", icon: ListChecks },
  { label: "Parties", href: "/dashboard/parties", icon: Users },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Verifications", href: "/dashboard/verifications", icon: ShieldCheck, adminOnly: true },
  { label: "Users", href: "/dashboard/users", icon: Users, adminOnly: true },
  { label: "Audit Log", href: "/dashboard/audit", icon: ScrollText, adminOnly: true },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
