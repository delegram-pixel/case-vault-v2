import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: string | string[]) {
  const user = await requireUser();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) redirect("/dashboard");
  return user;
}
