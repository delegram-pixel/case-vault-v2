"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createUserSchema, type CreateUserInput } from "@/lib/validations";

type Result = { ok: true; id: string } | { ok: false; error: string };

export async function createUser(input: CreateUserInput): Promise<Result> {
  const admin = await getCurrentUser();
  if (!admin) return { ok: false, error: "You must be signed in." };
  if (admin.role !== "ADMIN") {
    return { ok: false, error: "Only administrators can create users." };
  }

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const created = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      role: parsed.data.role,
      // Admin-created accounts are active immediately.
      verified: true,
      verificationStatus: "Verified",
    },
  });

  revalidatePath("/dashboard/users");
  revalidatePath("/dashboard/verifications");
  return { ok: true, id: created.id };
}
