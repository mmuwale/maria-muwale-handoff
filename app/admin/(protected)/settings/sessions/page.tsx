import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getServerCaller } from "@/lib/trpc/server";
import { SESSION_COOKIE } from "@/lib/auth/sessionCookie";
import { SessionsList } from "@/modules/admin/components/SessionsList";

export const metadata: Metadata = { title: "Sessions", robots: { index: false } };

export default async function SessionsSettingsPage() {
  const caller = await getServerCaller();
  const sessions = await caller.auth.mySessions();
  const cookieStore = await cookies();
  const currentSessionId = cookieStore.get(SESSION_COOKIE)?.value;

  return <SessionsList sessions={sessions} currentSessionId={currentSessionId} />;
}
