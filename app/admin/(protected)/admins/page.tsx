import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getServerCaller } from "@/lib/trpc/server";
import { AdminsList } from "@/modules/admin/components/AdminsList";
import { CreateAdminForm } from "@/modules/admin/components/CreateAdminForm";

export const metadata: Metadata = { title: "Admins", robots: { index: false } };

export default async function AdminsPage() {
  const user = await getCurrentUser();
  if (!user?.permissions.has("admins.view")) redirect("/admin");

  const caller = await getServerCaller();
  const admins = await caller.admins.list();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-3xl font-semibold text-navy">Admins</h1>
      {user.permissions.has("admins.create") && <CreateAdminForm />}
      <AdminsList
        admins={admins}
        currentUserId={user.id}
        canDelete={user.permissions.has("admins.delete")}
      />
    </div>
  );
}
