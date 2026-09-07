import type { Metadata } from "next";
import { getServerCaller } from "@/lib/trpc/server";
import { AcceptInviteForm } from "@/modules/admin/components/AcceptInviteForm";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = { title: "Accept invite", robots: { index: false } };

export default async function AcceptInvitePage({ params }: Props) {
  const { token } = await params;
  const caller = await getServerCaller();
  const invite = await caller.invites.byToken({ token });

  return (
    <main className="flex min-h-dvh items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        {!invite ? (
          <>
            <h1 className="mb-3 font-serif text-3xl font-semibold text-navy">Invite not found</h1>
            <p className="text-navy/60">This invite link doesn&apos;t exist. Ask whoever added you for a new one.</p>
          </>
        ) : invite.expired ? (
          <>
            <h1 className="mb-3 font-serif text-3xl font-semibold text-navy">Invite expired</h1>
            <p className="text-navy/60">
              This link expired. Ask a super admin to remove and re-add {invite.name} to send a new one.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-1 font-serif text-3xl font-semibold text-navy">Welcome, {invite.name}</h1>
            <p className="mb-6 text-navy/60">{invite.email} - set a password to activate your account.</p>
            <AcceptInviteForm token={token} />
          </>
        )}
      </div>
    </main>
  );
}
