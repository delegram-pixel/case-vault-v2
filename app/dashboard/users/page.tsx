import type { Metadata } from "next";
import { ShieldCheck, UserCog, Users as UsersIcon } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { UsersView } from "@/components/dashboard/users-view";
import { getAllUsers } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  await requireRole("ADMIN");
  const users = await getAllUsers();
  const staff = users.filter((u) => u.role !== "ATTORNEY").length;
  const attorneys = users.filter((u) => u.role === "ATTORNEY").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Provision accounts and manage everyone with access to the registry."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={users.length} sub="all accounts" icon={UsersIcon} />
        <StatCard label="Registry staff" value={staff} sub="clerks, judges, admins" icon={UserCog} />
        <StatCard label="Attorneys" value={attorneys} sub="practitioners" icon={ShieldCheck} />
      </div>
      <UsersView users={users} />
    </div>
  );
}
