import type { Metadata } from "next";
import { LoginForm } from "@/modules/admin/components/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 font-serif text-3xl font-semibold text-navy">
          Admin sign in
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
