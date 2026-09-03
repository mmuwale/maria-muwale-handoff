"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export function CreateAdminForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const create = trpc.admins.create.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({ name, email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-navy/15 bg-white px-3 py-2 text-navy outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-navy/15 bg-white px-3 py-2 text-navy outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">Password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-navy/15 bg-white px-3 py-2 text-navy outline-none focus:border-gold"
        />
      </div>
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-ivory hover:bg-navy-d disabled:opacity-60"
      >
        {create.isPending ? "Creating..." : "Add feedback admin"}
      </button>
      {create.error && <p className="w-full text-sm text-blush-i">{create.error.message}</p>}
    </form>
  );
}
