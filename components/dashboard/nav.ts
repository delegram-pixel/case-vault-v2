import {
  CalendarClock,
  FilePlus2,
  FolderClosed,
  LayoutDashboard,
  ListChecks,
  MapPin,
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
}

export const MAIN_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "File a Case", href: "/dashboard/cases/new", icon: FilePlus2 },
  { label: "Court Finder", href: "/find", icon: MapPin },
];

export const MODULE_NAV: NavItem[] = [
  { label: "Hearings", href: "/dashboard", icon: CalendarClock, soon: true },
  { label: "Documents", href: "/dashboard", icon: FolderClosed, soon: true },
  { label: "Dockets", href: "/dashboard", icon: ListChecks, soon: true },
  { label: "Parties", href: "/dashboard", icon: Users, soon: true },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Verifications", href: "/dashboard", icon: ShieldCheck, soon: true },
  { label: "Settings", href: "/dashboard", icon: Settings, soon: true },
];
