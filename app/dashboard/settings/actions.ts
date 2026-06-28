"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  firm: z.string().optional(),
  state: z.string().optional(),
});

type Result = { ok: true } | { ok: false; error: string };

export async function saveProfile(
  input: z.infer<typeof profileSchema>
): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      firm: parsed.data.firm || null,
      state: parsed.data.state || null,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
