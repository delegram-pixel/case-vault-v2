import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotSchema } from "@/lib/validations";
import { notify } from "@/lib/notify";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Only create a token + send mail if the account exists, but always respond
  // the same way so we don't leak which emails are registered.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const link = `${base}/reset/${token}`;
    await notify({
      channel: "email",
      to: email,
      subject: "Reset your Case Vault password",
      body: `Use this link within the hour to set a new password:\n${link}`,
    });
  }

  return NextResponse.json({ ok: true });
}
