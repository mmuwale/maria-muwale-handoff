"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [done, setDone] = useState(false);

  const change = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setDone(true);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDone(false);
    change.mutate({ currentPassword, newPassword });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">Current password</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-navy outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-navy/60">New password</label>
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-navy outline-none focus:border-gold"
        />
      </div>
      <button
        type="submit"
        disabled={change.isPending}
        className="self-start rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-ivory hover:bg-navy-d disabled:opacity-60"
      >
        {change.isPending ? "Updating..." : "Update password"}
      </button>
      {change.error && <p className="text-sm text-blush-i">{change.error.message}</p>}
      {done && !change.error && <p className="text-sm text-gold-d">Password updated.</p>}
    </form>
  );
}
