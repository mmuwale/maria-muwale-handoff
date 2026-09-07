"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export function DeleteAdminButton({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const remove = trpc.admins.delete.useMutation({ onSuccess: () => router.refresh() });

  function handleClick() {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    remove.mutate({ userId });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={remove.isPending}
        className="text-xs font-semibold text-blush-i hover:underline disabled:opacity-60"
      >
        {remove.isPending ? "Deleting..." : "Delete"}
      </button>
      {remove.error && <p className="text-xs text-blush-i">{remove.error.message}</p>}
    </div>
  );
}
