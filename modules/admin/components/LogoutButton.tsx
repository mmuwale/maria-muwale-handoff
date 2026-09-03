"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export function LogoutButton() {
  const router = useRouter();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/admin/login");
      router.refresh();
    },
  });

  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      className="text-sm font-medium text-navy/60 hover:text-navy"
    >
      Sign out
    </button>
  );
}
