"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { toast } from "sonner";
import { initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

const ROLE_LABELS: Record<string, string> = {
  CLERK: "Court Clerk",
  JUDGE: "Judge",
  ATTORNEY: "Attorney",
  ADMIN: "Administrator",
};

export function DashboardHeader() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const name = session?.user?.name ?? "Account";
  const roleLabel = session?.user?.role
    ? ROLE_LABELS[session.user.role] ?? session.user.role
    : "";

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md sm:px-6">
      {/* Mobile nav trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search cases, parties, attorneys…"
          className="bg-secondary/50 border-0 pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell />
          <span className="bg-status-closed absolute top-2 right-2 size-1.5 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-secondary ml-1 flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors">
              <Avatar className="size-8">
                <AvatarFallback>{initials(name)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left sm:block">
                <span className="block text-sm leading-tight font-medium">
                  {name}
                </span>
                <span className="text-muted-foreground block text-xs leading-tight">
                  {roleLabel}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                toast.success("Signed out");
                signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
