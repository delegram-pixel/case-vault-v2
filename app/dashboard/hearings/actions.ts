"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  hearingSchema,
  HEARING_STATUSES,
  type HearingInput,
} from "@/lib/validations";
import { notify } from "@/lib/notify";

type ScheduleResult =
  | { ok: true; id: string }
  | { ok: false; error: string; conflict?: boolean };

const SCHEDULE_ROLES = ["CLERK", "ADMIN", "JUDGE"];

export async function scheduleHearing(
  input: HearingInput
): Promise<ScheduleResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You must be signed in." };
  if (!SCHEDULE_ROLES.includes(user.role)) {
    return { ok: false, error: "Your role cannot schedule hearings." };
  }

  const parsed = hearingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }
  const { caseId, eventType, date, time, room, judge } = parsed.data;
  const dateTime = new Date(`${date}T${time}:00`);
  if (Number.isNaN(dateTime.getTime())) {
    return { ok: false, error: "Invalid date or time." };
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { caseNumber: true },
  });
  if (!caseRecord) return { ok: false, error: "Case not found." };

  // Authoritative server-side conflict detection: same slot, same room OR judge.
  const clash = await prisma.hearing.findFirst({
    where: {
      status: "Scheduled",
      dateTime,
      OR: [{ roomNumber: room }, { judgeName: judge }],
    },
    include: { case: { select: { caseNumber: true } } },
  });
  if (clash) {
    return {
      ok: false,
      conflict: true,
      error: `Conflict: ${clash.roomNumber} / ${clash.judgeName} already has ${clash.eventType} (${clash.case.caseNumber}) at that time.`,
    };
  }

  const [created] = await prisma.$transaction([
    prisma.hearing.create({
      data: {
        caseId,
        eventType,
        dateTime,
        roomNumber: room,
        judgeName: judge,
        status: "Scheduled",
      },
    }),
    prisma.docketEntry.create({
      data: {
        caseId,
        docketType: "Hearing",
        docketText: `${eventType} scheduled for ${dateTime.toLocaleString("en-NG")} in ${room}.`,
        filingParty: user.name ?? "Registry",
      },
    }),
  ]);

  // Stub reminders (email + SMS) — logged, not dispatched.
  await notify({
    channel: "email",
    to: user.email ?? "registry@court.gov.ng",
    subject: `Hearing scheduled — ${caseRecord.caseNumber}`,
    body: `${eventType} on ${dateTime.toLocaleString("en-NG")} in ${room} before ${judge}.`,
  });

  revalidatePath("/dashboard/hearings");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/cases/${caseId}`);
  return { ok: true, id: created.id };
}

export async function updateHearingStatus(
  hearingId: string,
  status: string
): Promise<ScheduleResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You must be signed in." };
  if (!SCHEDULE_ROLES.includes(user.role)) {
    return { ok: false, error: "Your role cannot update hearings." };
  }
  if (!HEARING_STATUSES.includes(status as (typeof HEARING_STATUSES)[number])) {
    return { ok: false, error: "Invalid status." };
  }

  const hearing = await prisma.hearing.findUnique({ where: { id: hearingId } });
  if (!hearing) return { ok: false, error: "Hearing not found." };
  if (hearing.status === status) return { ok: true, id: hearingId };

  await prisma.$transaction([
    prisma.hearing.update({ where: { id: hearingId }, data: { status } }),
    prisma.docketEntry.create({
      data: {
        caseId: hearing.caseId,
        docketType: "Hearing",
        docketText: `${hearing.eventType} marked ${status}.`,
        filingParty: user.name ?? "Registry",
      },
    }),
  ]);

  revalidatePath("/dashboard/hearings");
  revalidatePath(`/dashboard/cases/${hearing.caseId}`);
  return { ok: true, id: hearingId };
}
