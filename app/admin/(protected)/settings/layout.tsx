import { SettingsNav } from "@/modules/admin/components/SettingsNav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-navy">Settings</h1>
      <SettingsNav />
      {children}
    </div>
  );
}
