import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CaseRecord,
  CaseStatus,
  CourtType,
  PartyRole,
} from "@/lib/types";
import type {
  AttorneyWithCase,
  DocketWithCase,
  DocumentWithCase,
  HearingWithCase,
  PartyWithCase,
} from "@/lib/aggregates";
import type { CourtBranch } from "@/lib/types";
import type { LawyerVerification } from "@/lib/admin-data";

const caseRefSelect = {
  id: true,
  caseNumber: true,
  title: true,
  courtState: true,
} as const;

const caseInclude = {
  parties: true,
  attorneys: true,
  documents: { orderBy: { uploadDate: "desc" } },
  docket: { orderBy: { filingDate: "asc" } },
  hearings: { orderBy: { dateTime: "asc" } },
  service: true,
} satisfies Prisma.CaseInclude;

type PrismaCaseWithRelations = Prisma.CaseGetPayload<{
  include: typeof caseInclude;
}>;

/** Map a Prisma Case (with relations) to the UI's CaseRecord shape. */
function toCaseRecord(c: PrismaCaseWithRelations): CaseRecord {
  return {
    id: c.id,
    caseNumber: c.caseNumber,
    title: c.title,
    description: c.description,
    status: c.status as CaseStatus,
    filingDate: c.filingDate.toISOString(),
    judge: c.judgeName,
    courtType: c.courtType as CourtType,
    courtState: c.courtState,
    parties: c.parties.map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role as PartyRole,
    })),
    attorneys: c.attorneys.map((a) => ({
      id: a.id,
      name: a.name,
      firm: a.firm ?? "",
      representing: a.representing,
      barNumber: a.barNumber ?? "",
    })),
    documents: c.documents.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      size: d.size ?? "—",
      uploadDate: d.uploadDate.toISOString(),
      url: d.url,
    })),
    docket: c.docket.map((d) => ({
      id: d.id,
      filingDate: d.filingDate.toISOString(),
      docketType: d.docketType,
      docketText: d.docketText,
      filingParty: d.filingParty,
    })),
    hearings: c.hearings.map((h) => ({
      id: h.id,
      eventType: h.eventType,
      dateTime: h.dateTime.toISOString(),
      roomNumber: h.roomNumber,
      judge: h.judgeName,
      status: h.status as CaseRecord["hearings"][number]["status"],
    })),
    service: c.service.map((s) => ({
      id: s.id,
      party: s.party,
      method: s.method,
      servedOn: s.servedOn.toISOString(),
      status: s.status as CaseRecord["service"][number]["status"],
    })),
  };
}

export async function getCases(): Promise<CaseRecord[]> {
  const cases = await prisma.case.findMany({
    include: caseInclude,
    orderBy: { filingDate: "desc" },
  });
  return cases.map(toCaseRecord);
}

export async function getCaseById(id: string): Promise<CaseRecord | null> {
  const c = await prisma.case.findFirst({
    where: { OR: [{ id }, { caseNumber: id }] },
    include: caseInclude,
  });
  return c ? toCaseRecord(c) : null;
}

export async function getDashboardStats() {
  const [total, open, pending, closed] = await Promise.all([
    prisma.case.count(),
    prisma.case.count({ where: { status: "Open" } }),
    prisma.case.count({ where: { status: "Pending" } }),
    prisma.case.count({ where: { status: "Closed" } }),
  ]);

  const upcoming = await prisma.hearing.findMany({
    where: { status: "Scheduled" },
    orderBy: { dateTime: "asc" },
    include: { case: { select: { id: true, caseNumber: true, title: true } } },
  });

  return {
    total,
    open,
    pending,
    closed,
    upcoming: upcoming.map((h) => ({
      id: h.id,
      eventType: h.eventType,
      dateTime: h.dateTime.toISOString(),
      roomNumber: h.roomNumber,
      judge: h.judgeName,
      caseId: h.case.id,
      caseNumber: h.case.caseNumber,
    })),
  };
}

// ── Aggregates across all cases (module pages) ───────────────────────

export async function getAllDocket(): Promise<DocketWithCase[]> {
  const rows = await prisma.docketEntry.findMany({
    orderBy: { filingDate: "desc" },
    include: { case: { select: caseRefSelect } },
  });
  return rows.map((d) => ({
    id: d.id,
    filingDate: d.filingDate.toISOString(),
    docketType: d.docketType,
    docketText: d.docketText,
    filingParty: d.filingParty,
    caseId: d.case.id,
    caseNumber: d.case.caseNumber,
    caseTitle: d.case.title,
    courtState: d.case.courtState,
  }));
}

export async function getAllParties(): Promise<PartyWithCase[]> {
  const rows = await prisma.party.findMany({
    include: { case: { select: caseRefSelect } },
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role as PartyWithCase["role"],
    caseId: p.case.id,
    caseNumber: p.case.caseNumber,
    caseTitle: p.case.title,
    courtState: p.case.courtState,
  }));
}

export async function getAllAttorneys(): Promise<AttorneyWithCase[]> {
  const rows = await prisma.attorney.findMany({
    include: { case: { select: caseRefSelect } },
  });
  return rows.map((a) => ({
    id: a.id,
    name: a.name,
    firm: a.firm ?? "",
    representing: a.representing,
    barNumber: a.barNumber ?? "",
    caseId: a.case.id,
    caseNumber: a.case.caseNumber,
    caseTitle: a.case.title,
    courtState: a.case.courtState,
  }));
}

export async function getAllHearings(): Promise<HearingWithCase[]> {
  const rows = await prisma.hearing.findMany({
    orderBy: { dateTime: "asc" },
    include: { case: { select: caseRefSelect } },
  });
  return rows.map((h) => ({
    id: h.id,
    eventType: h.eventType,
    dateTime: h.dateTime.toISOString(),
    roomNumber: h.roomNumber,
    judge: h.judgeName,
    status: h.status as HearingWithCase["status"],
    caseId: h.case.id,
    caseNumber: h.case.caseNumber,
    caseTitle: h.case.title,
    courtState: h.case.courtState,
  }));
}

export async function getAllDocuments(): Promise<DocumentWithCase[]> {
  const rows = await prisma.document.findMany({
    orderBy: { uploadDate: "desc" },
    include: { case: { select: caseRefSelect } },
  });
  return rows.map((d) => ({
    id: d.id,
    name: d.name,
    type: d.type,
    size: d.size ?? "—",
    uploadDate: d.uploadDate.toISOString(),
    url: d.url,
    caseId: d.case.id,
    caseNumber: d.case.caseNumber,
    caseTitle: d.case.title,
    courtState: d.case.courtState,
  }));
}

export async function getCourts(): Promise<CourtBranch[]> {
  const rows = await prisma.court.findMany({ orderBy: { name: "asc" } });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type as CourtBranch["type"],
    state: c.state,
    address: c.address,
    phone: c.phone,
    hours: c.hours,
    rating: c.rating,
  }));
}

/** Lightweight case list for selectors (e.g. scheduling a hearing). */
export async function getCaseOptions() {
  return prisma.case.findMany({
    select: { id: true, caseNumber: true, title: true },
    orderBy: { filingDate: "desc" },
  });
}

export async function getAttorneys(): Promise<LawyerVerification[]> {
  const rows = await prisma.user.findMany({
    where: { role: "ATTORNEY" },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    firm: u.firm ?? "—",
    barNumber: u.barNumber ?? "—",
    yearCalled: u.yearCalled ?? 0,
    state: u.state ?? "—",
    submittedOn: u.createdAt.toISOString(),
    status: u.verificationStatus as LawyerVerification["status"],
  }));
}

export async function getAllUsers() {
  const rows = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      verified: true,
      verificationStatus: true,
      firm: true,
      createdAt: true,
    },
  });
  return rows.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));
}

export type AdminUser = Awaited<ReturnType<typeof getAllUsers>>[number];

export async function getAuditLog(limit = 200) {
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id,
    actorName: r.actorName,
    actorRole: r.actorRole,
    action: r.action,
    target: r.target,
    detail: r.detail,
    createdAt: r.createdAt.toISOString(),
  }));
}

export type AuditEntry = Awaited<ReturnType<typeof getAuditLog>>[number];

export async function getUserProfile(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      firm: true,
      state: true,
      barNumber: true,
    },
  });
}
