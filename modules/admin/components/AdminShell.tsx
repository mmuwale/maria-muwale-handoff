import type { ReactNode } from "react";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ user, children }: { user: CurrentUser; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-ivory md:flex">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
