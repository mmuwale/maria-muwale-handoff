import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/modules/admin/components/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center border-b border-navy/10 bg-ivory/85 px-4 py-3 backdrop-blur-md sm:px-8 sm:py-3.5">
        <Link href="/" className="whitespace-nowrap font-serif text-base font-semibold tracking-[0.04em] text-navy sm:text-lg">
          MARIA <span className="text-blush-i">MUWALE</span>
        </Link>
      </header>
      <main className="flex min-h-dvh items-center justify-center bg-ivory px-6">
        <div className="w-full max-w-sm">
          <h1 className="mb-6 font-serif text-3xl font-semibold text-navy">
            Admin sign in
          </h1>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
