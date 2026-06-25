import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsView } from "@/components/dashboard/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, court assignment, notifications and security."
      />
      <SettingsView />
    </div>
  );
}
