"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { LogoutButton } from "./LogoutButton";

function NavLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-navy text-ivory" : "text-navy/70 hover:bg-navy/5 hover:text-navy"
      }`}
    >
      {children}
    </Link>
  );
}

/**
 * A permanent sidebar from md up; below that it collapses into a top bar
 * with a hamburger button that opens the same nav as a slide-in drawer.
 * The original fixed w-56 sidebar ate well over half of a 375px phone
 * screen on every admin page - this app is mostly used from phones.
 */
export function AdminSidebar({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const isSuperAdmin = user.permissions.has("admins.view");
  const close = () => setOpen(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      <NavLink href="/admin" onNavigate={close}>
        Forms
      </NavLink>
      {isSuperAdmin && (
        <NavLink href="/admin/admins" onNavigate={close}>
          Users
        </NavLink>
      )}
      <NavLink href="/admin/settings" onNavigate={close}>
        Settings
      </NavLink>
    </nav>
  );

  const account = (
    <div className="flex flex-col gap-2 border-t border-navy/10 px-3 pt-4">
      <Link href="/admin/settings/profile" onClick={close} className="truncate text-sm text-navy/60 hover:text-navy">
        {user.name}
      </Link>
      <LogoutButton />
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-navy/10 bg-white px-4 py-3 md:hidden">
        <Link href="/admin" className="font-serif text-lg font-semibold text-navy">
          Feedback Admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-navy/5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-navy/30 md:hidden" onClick={close} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col justify-between bg-white px-4 py-6 shadow-xl transition-transform duration-200 md:sticky md:top-0 md:z-auto md:h-dvh md:w-56 md:max-w-none md:translate-x-0 md:border-r md:border-navy/10 md:shadow-none md:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-3">
            <Link href="/admin" onClick={close} className="font-serif text-lg font-semibold text-navy">
              Feedback Admin
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-navy hover:bg-navy/5 md:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {nav}
        </div>

        {account}
      </aside>
    </>
  );
}
