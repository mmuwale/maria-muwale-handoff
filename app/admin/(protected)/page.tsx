import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getServerCaller } from "@/lib/trpc/server";
import { FormsList } from "@/modules/admin/components/FormsList";

export const metadata: Metadata = { title: "Forms", robots: { index: false } };

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const caller = await getServerCaller();
  const forms = await caller.adminForms.list();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-navy">Forms</h1>
        {user?.permissions.has("forms.create") && (
          <Link
            href="/admin/forms/new"
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-ivory hover:bg-navy-d"
          >
            New form
          </Link>
        )}
      </div>
      <FormsList forms={forms} />
    </div>
  );
}
