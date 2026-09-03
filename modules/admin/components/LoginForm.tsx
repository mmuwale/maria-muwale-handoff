"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = trpc.auth.login.useMutation({
    onSuccess: () => {
      router.push("/admin");
      router.refresh();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-navy">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-navy">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-gold"
        />
      </div>

      {login.error && <p className="text-sm text-blush-i">{login.error.message}</p>}

      <button
        type="submit"
        disabled={login.isPending}
        className="rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-ivory transition-colors hover:bg-navy-d disabled:opacity-60"
      >
        {login.isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
