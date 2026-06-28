import type { Metadata } from "next";
import { ResetForm } from "@/components/auth/reset-form";

export const metadata: Metadata = { title: "Set new password" };

export default function ResetPage({ params }: { params: { token: string } }) {
  return <ResetForm token={params.token} />;
}
