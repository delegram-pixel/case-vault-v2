"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  Bell,
  CalendarClock,
  FilePlus2,
  ListChecks,
  Loader2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getNotifications,
  type AppNotification,
  type NotificationKind,
} from "@/app/dashboard/notifications-actions";
import { cn } from "@/lib/utils";

const META: Record<NotificationKind, { icon: LucideIcon; tone: string }> = {
  hearing: { icon: CalendarClock, tone: "text-status-open" },
  verification: { icon: ShieldCheck, tone: "text-status-pending" },
  docket: { icon: ListChecks, tone: "text-muted-foreground" },
  case: { icon: FilePlus2, tone: "text-muted-foreground" },
};

export function NotificationsMenu() {
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [seen, setSeen] = useState(false);
  const [pending, start] = useTransition();

  // Fetch once on mount so the unread badge is accurate before opening.
  useEffect(() => {
    start(async () => setItems(await getNotifications()));
  }, []);

  const count = items?.length ?? 0;

  return (
    <DropdownMenu onOpenChange={(open) => open && setSeen(true)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell />
          {!seen && count > 0 && (
            <span className="bg-status-closed text-primary-foreground absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm font-medium">Notifications</span>
          {count > 0 && (
            <span className="text-muted-foreground text-xs">{count} new</span>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-96 overflow-y-auto p-1">
          {pending && !items && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            </div>
          )}

          {items && items.length === 0 && (
            <div className="py-8 text-center">
              <Bell className="text-muted-foreground mx-auto size-6" />
              <p className="text-muted-foreground mt-2 text-sm">
                You&apos;re all caught up.
              </p>
            </div>
          )}

          {items?.map((n) => {
            const { icon: Icon, tone } = META[n.kind];
            return (
              <DropdownMenuItem key={n.id} asChild className="p-0">
                <Link href={n.href} className="flex items-start gap-3 p-2.5">
                  <div className="bg-secondary grid size-8 shrink-0 place-items-center rounded-lg">
                    <Icon className={cn("size-4", tone)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {n.description}
                    </p>
                    <p className="text-muted-foreground/70 mt-0.5 text-[11px]">
                      {formatDistanceToNow(new Date(n.time), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>

        {items && items.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <DropdownMenuItem asChild className="justify-center">
              <Link
                href="/dashboard/hearings"
                className="text-muted-foreground w-full text-center text-xs"
              >
                View all hearings
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
