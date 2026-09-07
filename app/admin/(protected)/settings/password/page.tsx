import type { Metadata } from "next";
import { ChangePasswordForm } from "@/modules/admin/components/ChangePasswordForm";

export const metadata: Metadata = { title: "Password", robots: { index: false } };

export default function PasswordSettingsPage() {
  return <ChangePasswordForm />;
}
