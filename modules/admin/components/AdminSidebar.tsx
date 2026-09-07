"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { LogoutButton } from "./LogoutButton";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-navy text-ivory" : "text-navy/70 hover:bg-navy/5 hover:text-navy"
      }`}
    >
      {children}
    </Link>
  );
}

export function AdminSidebar({ user }: { user: CurrentUser }) {
  const isSuperAdmin = user.permissions.has("admins.view");

  return (
    <aside className="flex h-dvh w-56 flex-col justify-between border-r border-navy/10 bg-white px-4 py-6">
      <div className="flex flex-col gap-6">
        <Link href="/admin" className="px-3 font-serif text-lg font-semibold text-navy">
          Feedback Admin
        </Link>
        <nav className="flex flex-col gap-1">
          <NavLink href="/admin">Forms</NavLink>
          {isSuperAdmin && <NavLink href="/admin/admins">Users</NavLink>}
          <NavLink href="/admin/settings">Settings</NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-2 border-t border-navy/10 px-3 pt-4">
        <Link href="/admin/settings/profile" className="truncate text-sm text-navy/60 hover:text-navy">
          {user.name}
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
