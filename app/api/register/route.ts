import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password, role, barNumber } = parsed.data;

  // Privileged roles are provisioned by an administrator, never self-served.
  if (role === "JUDGE" || role === "ADMIN") {
    return NextResponse.json(
      { error: "Judge and admin accounts are created by an administrator." },
      { status: 403 }
    );
  }

  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const isAttorney = role === "ATTORNEY";

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      // Attorneys must be verified by an admin before they gain filing access.
      verified: !isAttorney,
      verificationStatus: isAttorney ? "Pending" : "Verified",
      barNumber: isAttorney ? barNumber : null,
    },
  });

  return NextResponse.json(
    { ok: true, pendingVerification: isAttorney },
    { status: 201 }
  );
}
