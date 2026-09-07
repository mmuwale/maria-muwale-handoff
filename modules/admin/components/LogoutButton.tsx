"use client";

import { trpc } from "@/lib/trpc/react";

export function LogoutButton() {
  const logout = trpc.auth.logout.useMutation({
    // A full navigation, not router.push + refresh - guarantees no stale
    // client-side RSC segment can still be in flight for a protected route
    // after the session is gone (see the double-logout-click race that hit
    // AdminDashboardPage with a null ctx.user despite the layout's guard).
    onSuccess: () => {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- deliberate hard navigation, see comment above
      window.location.href = "/admin/login";
    },
  });

  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className="text-sm font-medium text-navy/60 hover:text-navy disabled:opacity-60"
    >
      {logout.isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
