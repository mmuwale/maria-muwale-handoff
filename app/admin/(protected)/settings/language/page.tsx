import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { LanguageForm } from "@/modules/admin/components/LanguageForm";

export const metadata: Metadata = { title: "Language", robots: { index: false } };

export default async function LanguageSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <LanguageForm language={user.language} />;
}
