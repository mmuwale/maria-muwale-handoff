"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";
import type { Session } from "@/lib/db/schema";

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

function RevokeButton({ sessionId, isCurrent }: { sessionId: string; isCurrent: boolean }) {
  const router = useRouter();
  const revoke = trpc.auth.revokeSession.useMutation({
    onSuccess: () => {
      if (isCurrent) {
        router.push("/admin/login");
      } else {
        router.refresh();
      }
    },
  });

  return (
    <button
      type="button"
      onClick={() => revoke.mutate({ sessionId })}
      disabled={revoke.isPending}
      className="text-xs font-semibold text-blush-i hover:underline disabled:opacity-60"
    >
      {revoke.isPending ? "Signing out..." : isCurrent ? "Sign out" : "Revoke"}
    </button>
  );
}

export function SessionsList({
  sessions,
  currentSessionId,
}: {
  sessions: Session[];
  currentSessionId: string | undefined;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy/10">
            <th className="px-4 py-3 font-semibold text-navy/60">Signed in</th>
            <th className="px-4 py-3 font-semibold text-navy/60">Expires</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const isCurrent = session.id === currentSessionId;
            return (
              <tr key={session.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3 text-navy">
                  {dateFormat.format(session.createdAt)}
                  {isCurrent && <span className="ml-2 text-xs font-semibold text-gold-d">This device</span>}
                </td>
                <td className="px-4 py-3 text-navy/70">{dateFormat.format(session.expiresAt)}</td>
                <td className="px-4 py-3 text-right">
                  <RevokeButton sessionId={session.id} isCurrent={isCurrent} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
