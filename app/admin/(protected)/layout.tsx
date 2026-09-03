import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { AdminShell } from "@/modules/admin/components/AdminShell";

/**
 * The auth gate for every /admin route except /admin/login. Deliberately a
 * layout calling the DAL directly, not a proxy/middleware file - middleware
 * is edge-level routing, not a security boundary (CVE-2025-29927). Every
 * tRPC procedure this UI calls re-checks permissions independently anyway.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return <AdminShell user={user}>{children}</AdminShell>;
}
