import Link from "next/link";
import type { ReactNode } from "react";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { LogoutButton } from "./LogoutButton";

export function AdminShell({ user, children }: { user: CurrentUser; children: ReactNode }) {
  const isSuperAdmin = user.permissions.has("admins.view");

  return (
    <div className="min-h-dvh bg-ivory">
      <nav className="flex items-center justify-between border-b border-navy/10 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-serif text-lg font-semibold text-navy">
            Feedback Admin
          </Link>
          {isSuperAdmin && (
            <Link href="/admin/admins" className="text-sm font-medium text-navy/60 hover:text-navy">
              Admins
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/account" className="text-sm text-navy/60 hover:text-navy">
            {user.name}
          </Link>
          <LogoutButton />
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
