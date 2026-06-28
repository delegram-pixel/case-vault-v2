import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsView } from "@/components/dashboard/settings-view";
import { getCurrentUser } from "@/lib/session";
import { getUserProfile } from "@/lib/queries";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  const profile = await getUserProfile(current.id);
  if (!profile) redirect("/login");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, court assignment, notifications and security."
      />
      <SettingsView profile={profile} />
    </div>
  );
}
