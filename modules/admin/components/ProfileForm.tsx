"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export function ProfileForm({ name: initialName, email: initialEmail }: { name: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [done, setDone] = useState(false);

  const update = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      setDone(true);
      router.refresh();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDone(false);
    update.mutate({ name, email });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-navy outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-navy outline-none focus:border-gold"
        />
      </div>
      <button
        type="submit"
        disabled={update.isPending}
        className="self-start rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-ivory hover:bg-navy-d disabled:opacity-60"
      >
        {update.isPending ? "Saving..." : "Save profile"}
      </button>
      {update.error && <p className="text-sm text-blush-i">{update.error.message}</p>}
      {done && !update.error && <p className="text-sm text-gold-d">Profile updated.</p>}
    </form>
  );
}
