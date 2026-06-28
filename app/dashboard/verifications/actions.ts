"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notify } from "@/lib/notify";

type Result = { ok: true } | { ok: false; error: string };

export async function setVerification(
  userId: string,
  status: "Verified" | "Rejected"
): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You must be signed in." };
  if (user.role !== "ADMIN") {
    return { ok: false, error: "Only administrators can verify practitioners." };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || target.role !== "ATTORNEY") {
    return { ok: false, error: "Practitioner not found." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationStatus: status,
      verified: status === "Verified",
    },
  });

  await notify({
    channel: "email",
    to: target.email,
    subject:
      status === "Verified"
        ? "Your Case Vault practitioner account is verified"
        : "Your Case Vault verification was unsuccessful",
    body:
      status === "Verified"
        ? "You can now file cases and appear on matters."
        : "Please contact the registry to resolve your bar credential check.",
  });

  revalidatePath("/dashboard/verifications");
  return { ok: true };
}
