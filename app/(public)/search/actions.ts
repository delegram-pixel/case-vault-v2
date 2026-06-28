"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export interface PublicCaseResult {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  filingDate: string;
  judge: string;
  courtType: string;
  courtState: string;
  parties: { id: string; name: string; role: string }[];
  nextHearing: { eventType: string; dateTime: string; roomNumber: string } | null;
  latestDocket: { filingDate: string; docketText: string } | null;
}

/**
 * Public registry search. Returns only public-safe fields — no documents,
 * service records, or internal notes.
 */
export async function searchPublicCases(
  query: string
): Promise<PublicCaseResult[]> {
  const q = query.trim();
  if (!q) return [];

  // Rate-limit by client IP to protect the public route.
  const hdrs = headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "anonymous";
  if (!rateLimit(`search:${ip}`, 30, 10_000).ok) {
    return [];
  }

  const cases = await prisma.case.findMany({
    where: {
      OR: [
        { caseNumber: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: { filingDate: "desc" },
    include: {
      parties: true,
      hearings: { where: { status: "Scheduled" }, orderBy: { dateTime: "asc" }, take: 1 },
      docket: { orderBy: { filingDate: "desc" }, take: 1 },
    },
  });

  return cases.map((c) => ({
    id: c.id,
    caseNumber: c.caseNumber,
    title: c.title,
    description: c.description,
    status: c.status,
    filingDate: c.filingDate.toISOString(),
    judge: c.judgeName,
    courtType: c.courtType,
    courtState: c.courtState,
    parties: c.parties.map((p) => ({ id: p.id, name: p.name, role: p.role })),
    nextHearing: c.hearings[0]
      ? {
          eventType: c.hearings[0].eventType,
          dateTime: c.hearings[0].dateTime.toISOString(),
          roomNumber: c.hearings[0].roomNumber,
        }
      : null,
    latestDocket: c.docket[0]
      ? {
          filingDate: c.docket[0].filingDate.toISOString(),
          docketText: c.docket[0].docketText,
        }
      : null,
  }));
}
