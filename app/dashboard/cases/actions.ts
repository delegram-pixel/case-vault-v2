"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import {
  caseSchema,
  CASE_STATUSES,
  partySchema,
  attorneySchema,
  docketEntrySchema,
  type CaseInput,
} from "@/lib/validations";
import { z } from "zod";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

const FILING_ROLES = ["CLERK", "ADMIN", "ATTORNEY"];
const STATUS_ROLES = ["CLERK", "ADMIN", "JUDGE"];
const EDIT_ROLES = ["CLERK", "ADMIN"];
const DOCKET_ROLES = ["CLERK", "ADMIN", "JUDGE"];

async function authorize(roles: string[]) {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "You must be signed in." };
  if (!roles.includes(user.role)) {
    return { user: null, error: "Your role cannot perform this action." };
  }
  return { user, error: null };
}

function revalidateCase(caseId: string) {
  revalidatePath(`/dashboard/cases/${caseId}`);
  revalidatePath("/dashboard");
}

export async function createCase(input: CaseInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You must be signed in." };
  if (!FILING_ROLES.includes(user.role)) {
    return { ok: false, error: "Your role cannot file cases." };
  }
  if (user.role === "ATTORNEY" && !user.verified) {
    return { ok: false, error: "Your account is pending verification." };
  }

  const parsed = caseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  try {
    const created = await prisma.case.create({
      data: {
        caseNumber: data.caseNumber,
        title: data.title,
        description: data.description,
        status: data.status,
        judgeName: data.judge,
        courtType: data.courtType,
        courtState: data.courtState,
        createdById: user.id,
        parties: {
          create: data.parties.map((p) => ({ name: p.name, role: p.role })),
        },
        attorneys: {
          create: data.attorneys.map((a) => ({
            name: a.name,
            firm: a.firm || null,
            representing: a.representing,
          })),
        },
        docket: {
          create: {
            docketType: "Filing",
            docketText: `Case filed: ${data.title}.`,
            filingParty: user.name ?? "Registry",
          },
        },
      },
    });

    await logAudit(user, "case.create", data.caseNumber, data.title);
    revalidatePath("/dashboard");
    return { ok: true, id: created.id };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: "That case number already exists." };
    }
    return { ok: false, error: "Could not file the case. Please try again." };
  }
}

export async function updateCaseStatus(
  caseId: string,
  status: string
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You must be signed in." };
  if (!STATUS_ROLES.includes(user.role)) {
    return { ok: false, error: "Your role cannot change case status." };
  }
  if (!CASE_STATUSES.includes(status as (typeof CASE_STATUSES)[number])) {
    return { ok: false, error: "Invalid status." };
  }

  const existing = await prisma.case.findUnique({ where: { id: caseId } });
  if (!existing) return { ok: false, error: "Case not found." };
  if (existing.status === status) return { ok: true, id: caseId };

  await prisma.case.update({
    where: { id: caseId },
    data: {
      status,
      docket: {
        create: {
          docketType: "Order",
          docketText: `Case status changed from ${existing.status} to ${status}.`,
          filingParty: user.name ?? "Registry",
        },
      },
    },
  });

  await logAudit(
    user,
    "case.status",
    existing.caseNumber,
    `${existing.status} → ${status}`
  );
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/cases/${caseId}`);
  return { ok: true, id: caseId };
}

// ── Case details ─────────────────────────────────────────────────────

const caseDetailsSchema = z.object({
  title: z.string().min(5, "Give the case a descriptive title"),
  description: z.string().min(10, "Add a short description (10+ characters)"),
});

export async function updateCaseDetails(
  caseId: string,
  input: z.infer<typeof caseDetailsSchema>
): Promise<ActionResult> {
  const { user, error } = await authorize(EDIT_ROLES);
  if (error || !user) return { ok: false, error: error ?? "Unauthorized" };

  const parsed = caseDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const existing = await prisma.case.findUnique({ where: { id: caseId } });
  if (!existing) return { ok: false, error: "Case not found." };

  await prisma.case.update({
    where: { id: caseId },
    data: { title: parsed.data.title, description: parsed.data.description },
  });
  await logAudit(user, "case.update", existing.caseNumber);
  revalidateCase(caseId);
  return { ok: true, id: caseId };
}

// ── Parties ──────────────────────────────────────────────────────────

export async function addParty(
  caseId: string,
  input: z.infer<typeof partySchema>
): Promise<ActionResult> {
  const { error } = await authorize(EDIT_ROLES);
  if (error) return { ok: false, error };

  const parsed = partySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid party" };
  }

  const created = await prisma.party.create({
    data: { caseId, name: parsed.data.name, role: parsed.data.role },
  });
  revalidateCase(caseId);
  revalidatePath("/dashboard/parties");
  return { ok: true, id: created.id };
}

export async function removeParty(
  caseId: string,
  partyId: string
): Promise<ActionResult> {
  const { error } = await authorize(EDIT_ROLES);
  if (error) return { ok: false, error };

  await prisma.party.delete({ where: { id: partyId } });
  revalidateCase(caseId);
  revalidatePath("/dashboard/parties");
  return { ok: true, id: partyId };
}

// ── Attorneys ────────────────────────────────────────────────────────

export async function addAttorney(
  caseId: string,
  input: z.infer<typeof attorneySchema>
): Promise<ActionResult> {
  const { error } = await authorize(EDIT_ROLES);
  if (error) return { ok: false, error };

  const parsed = attorneySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid attorney" };
  }

  const created = await prisma.attorney.create({
    data: {
      caseId,
      name: parsed.data.name,
      firm: parsed.data.firm || null,
      representing: parsed.data.representing,
    },
  });
  revalidateCase(caseId);
  revalidatePath("/dashboard/parties");
  return { ok: true, id: created.id };
}

export async function removeAttorney(
  caseId: string,
  attorneyId: string
): Promise<ActionResult> {
  const { error } = await authorize(EDIT_ROLES);
  if (error) return { ok: false, error };

  await prisma.attorney.delete({ where: { id: attorneyId } });
  revalidateCase(caseId);
  revalidatePath("/dashboard/parties");
  return { ok: true, id: attorneyId };
}

// ── Documents ────────────────────────────────────────────────────────

export async function deleteDocument(
  caseId: string,
  documentId: string
): Promise<ActionResult> {
  const { user, error } = await authorize(EDIT_ROLES);
  if (error || !user) return { ok: false, error: error ?? "Unauthorized" };

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc) return { ok: false, error: "Document not found." };

  // Remove from cloud storage (ignore failures for legacy/sample rows).
  if (doc.key) {
    try {
      await utapi.deleteFiles(doc.key);
    } catch {
      // best-effort
    }
  }

  await prisma.$transaction([
    prisma.document.delete({ where: { id: documentId } }),
    prisma.docketEntry.create({
      data: {
        caseId,
        docketType: "Filing",
        docketText: `Document removed: ${doc.name}.`,
        filingParty: user.name ?? "Registry",
      },
    }),
  ]);

  await logAudit(user, "document.delete", doc.name);
  revalidateCase(caseId);
  revalidatePath("/dashboard/documents");
  return { ok: true, id: documentId };
}

// ── Docket ───────────────────────────────────────────────────────────

export async function addDocketEntry(
  caseId: string,
  input: z.infer<typeof docketEntrySchema>
): Promise<ActionResult> {
  const { error } = await authorize(DOCKET_ROLES);
  if (error) return { ok: false, error };

  const parsed = docketEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid entry" };
  }

  const created = await prisma.docketEntry.create({
    data: {
      caseId,
      docketType: parsed.data.docketType,
      docketText: parsed.data.docketText,
      filingParty: parsed.data.filingParty,
    },
  });
  revalidateCase(caseId);
  revalidatePath("/dashboard/dockets");
  return { ok: true, id: created.id };
}
