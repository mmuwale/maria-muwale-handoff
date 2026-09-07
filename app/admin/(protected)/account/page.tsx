import type { Metadata } from "next";
import { ChangePasswordForm } from "@/modules/admin/components/ChangePasswordForm";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default function AccountPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-navy">Account</h1>
      <ChangePasswordForm />
    </div>
  );
}
