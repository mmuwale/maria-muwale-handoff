"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export function CreateAdminForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ message: string; inviteUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const create = trpc.admins.create.useMutation({
    onSuccess: (admin) => {
      setName("");
      setEmail("");
      setCopied(false);
      setResult({
        message: admin.emailSent
          ? `Invite sent to ${admin.email}. You can also copy the link below.`
          : `${admin.name} was created, but the invite email failed to send - copy the link below and share it directly.`,
        inviteUrl: admin.inviteUrl,
      });
      router.refresh();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    create.mutate({ name, email });
  }

  async function copyLink() {
    if (!result) return;
    await navigator.clipboard.writeText(result.inviteUrl);
    setCopied(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
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
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-ivory hover:bg-navy-d disabled:opacity-60"
        >
          {create.isPending ? "Sending invite..." : "Invite feedback admin"}
        </button>
      </div>

      {create.error && <p className="text-sm text-blush-i">{create.error.message}</p>}

      {result && (
        <div className="flex flex-col gap-2 rounded-xl border border-navy/10 bg-white p-3">
          <p className="text-sm text-gold-d">{result.message}</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={result.inviteUrl}
              onFocus={(e) => e.target.select()}
              className="min-w-0 flex-1 truncate rounded-lg border border-navy/15 bg-ivory px-3 py-1.5 text-xs text-navy/70"
            />
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 rounded-full border border-navy/20 px-3 py-1.5 text-xs font-semibold text-navy hover:border-navy"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
