import { prisma } from "@/lib/prisma";

interface Actor {
  id?: string | null;
  name?: string | null;
  role?: string | null;
}

/**
 * Records a system action in the audit log. Best-effort: never throws, so it
 * can't break the action that triggered it.
 */
export async function logAudit(
  actor: Actor,
  action: string,
  target?: string,
  detail?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actor.id ?? null,
        actorName: actor.name ?? "Unknown",
        actorRole: actor.role ?? null,
        action,
        target: target ?? null,
        detail: detail ?? null,
      },
    });
  } catch {
    // audit is best-effort
  }
}
