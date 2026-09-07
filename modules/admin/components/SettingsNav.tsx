"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/settings/profile", label: "Profile" },
  { href: "/admin/settings/password", label: "Password" },
  { href: "/admin/settings/sessions", label: "Sessions" },
  { href: "/admin/settings/language", label: "Language" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex gap-1 border-b border-navy/10">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-b-2 border-navy text-navy"
                : "border-b-2 border-transparent text-navy/50 hover:text-navy"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
