"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export function PublishButton({ formId }: { formId: string }) {
  const router = useRouter();
  const publish = trpc.adminForms.publish.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <button
      type="button"
      onClick={() => publish.mutate({ formId })}
      disabled={publish.isPending}
      className="rounded-full bg-gold-d px-5 py-2.5 text-sm font-bold text-ivory hover:opacity-90 disabled:opacity-60"
    >
      {publish.isPending ? "Publishing..." : "Publish"}
    </button>
  );
}
