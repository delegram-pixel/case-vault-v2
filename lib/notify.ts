import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

type Channel = "email" | "sms";

interface NotifyInput {
  channel: Channel;
  to: string;
  subject: string;
  body: string;
}

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;
const FROM = process.env.EMAIL_FROM ?? "Case Vault <onboarding@resend.dev>";

/**
 * Sends a notification and records it in the Notification table (audit log).
 * - Email is delivered via Resend when RESEND_API_KEY is set; otherwise logged.
 * - SMS is still stubbed (logged) — swap in Termii/Twilio here later.
 * Failures never throw, so they can't break the calling action.
 */
async function dispatch({ channel, to, subject, body }: NotifyInput) {
  let status: "logged" | "sent" | "failed" = "logged";

  if (channel === "email" && resend) {
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to,
        subject,
        text: body,
      });
      status = error ? "failed" : "sent";
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[notify:email] Resend error:", error);
      }
    } catch (e) {
      status = "failed";
      // eslint-disable-next-line no-console
      console.error("[notify:email] send threw:", e);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(`[notify:${channel}] → ${to} · ${subject}\n${body}`);
  }

  try {
    await prisma.notification.create({
      data: { channel, toAddress: to, subject, body, status },
    });
  } catch {
    // audit write is best-effort
  }
}

export async function notify(input: NotifyInput) {
  return dispatch(input);
}

/** Convenience: queue both an email and an SMS reminder. */
export async function notifyBoth(opts: {
  email: string;
  phone?: string;
  subject: string;
  body: string;
}) {
  await notify({ channel: "email", to: opts.email, subject: opts.subject, body: opts.body });
  if (opts.phone) {
    await notify({ channel: "sms", to: opts.phone, subject: opts.subject, body: opts.body });
  }
}
