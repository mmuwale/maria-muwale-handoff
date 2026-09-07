import type { ReactNode } from "react";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ user, children }: { user: CurrentUser; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-ivory">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-y-auto px-8 py-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
