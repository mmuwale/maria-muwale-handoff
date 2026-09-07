"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";
import type { Form } from "@/lib/db/schema";

export function PublishButton({ formId, status }: { formId: string; status: Form["status"] }) {
  const router = useRouter();
  const publish = trpc.adminForms.publish.useMutation({ onSuccess: () => router.refresh() });
  const close = trpc.adminForms.close.useMutation({ onSuccess: () => router.refresh() });

  if (status === "published") {
    return (
      <button
        type="button"
        onClick={() => close.mutate({ formId })}
        disabled={close.isPending}
        className="rounded-full bg-navy/10 px-5 py-2.5 text-sm font-bold text-navy hover:bg-navy/15 disabled:opacity-60"
      >
        {close.isPending ? "Deactivating..." : "Deactivate"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => publish.mutate({ formId })}
      disabled={publish.isPending}
      className="rounded-full bg-gold-d px-5 py-2.5 text-sm font-bold text-ivory hover:opacity-90 disabled:opacity-60"
    >
      {publish.isPending ? "Activating..." : status === "closed" ? "Reactivate" : "Activate"}
    </button>
  );
}
