"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export function AcceptInviteForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const accept = trpc.invites.accept.useMutation({
    onSuccess: () => {
      router.push("/admin");
      router.refresh();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    accept.mutate({ token, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-navy">Choose a password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-gold"
        />
      </div>

      {accept.error && <p className="text-sm text-blush-i">{accept.error.message}</p>}

      <button
        type="submit"
        disabled={accept.isPending}
        className="rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-ivory transition-colors hover:bg-navy-d disabled:opacity-60"
      >
        {accept.isPending ? "Setting password..." : "Activate account"}
      </button>
    </form>
  );
}
