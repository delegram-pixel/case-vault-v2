"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type NotificationKind = "hearing" | "verification" | "docket" | "case";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  href: string;
  time: string;
}

/**
 * Role-aware activity feed for the header bell:
 *  - upcoming hearings (next 7 days)
 *  - pending attorney verifications (admins only)
 *  - recent docket activity and newly filed cases
 */
export async function getNotifications(): Promise<AppNotification[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const now = new Date();
  const inWeek = new Date(now.getTime() + 7 * 864e5);
  const isAdmin = user.role === "ADMIN";

  const [hearings, pending, docket, cases] = await Promise.all([
    prisma.hearing.findMany({
      where: { status: "Scheduled", dateTime: { gte: now, lte: inWeek } },
      orderBy: { dateTime: "asc" },
      take: 5,
      include: { case: { select: { id: true, caseNumber: true } } },
    }),
    isAdmin
      ? prisma.user.findMany({
          where: { role: "ATTORNEY", verificationStatus: "Pending" },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : Promise.resolve([]),
    prisma.docketEntry.findMany({
      orderBy: { filingDate: "desc" },
      take: 5,
      include: { case: { select: { id: true, caseNumber: true } } },
    }),
    prisma.case.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  // Time-sensitive items first (soonest hearing on top).
  const upcoming: AppNotification[] = hearings.map((h) => ({
    id: `h-${h.id}`,
    kind: "hearing",
    title: `Upcoming: ${h.eventType}`,
    description: `${h.case.caseNumber} · ${h.roomNumber} · ${h.judgeName}`,
    href: `/dashboard/cases/${h.case.id}`,
    time: h.dateTime.toISOString(),
  }));

  // Everything else, merged and sorted by most recent.
  const recent: AppNotification[] = [
    ...pending.map((u) => ({
      id: `v-${u.id}`,
      kind: "verification" as const,
      title: "Verification requested",
      description: `${u.name} · ${u.barNumber ?? "no bar number"}`,
      href: "/dashboard/verifications",
      time: u.createdAt.toISOString(),
    })),
    ...docket.map((d) => ({
      id: `d-${d.id}`,
      kind: "docket" as const,
      title: d.docketType,
      description: `${d.case.caseNumber} · ${d.docketText}`,
      href: `/dashboard/cases/${d.case.id}`,
      time: d.filingDate.toISOString(),
    })),
    ...cases.map((c) => ({
      id: `c-${c.id}`,
      kind: "case" as const,
      title: `Case filed: ${c.caseNumber}`,
      description: c.title,
      href: `/dashboard/cases/${c.id}`,
      time: c.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 6);

  return [...upcoming, ...recent].slice(0, 10);
}
