import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ProfileForm } from "@/modules/admin/components/ProfileForm";

export const metadata: Metadata = { title: "Profile", robots: { index: false } };

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <ProfileForm name={user.name} email={user.email} />;
}
