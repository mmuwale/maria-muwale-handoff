import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerCaller } from "@/lib/trpc/server";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Feedback forms",
  robots: { index: false },
};

export default async function FormsIndexPage() {
  const caller = await getServerCaller();
  const forms = await caller.forms.listPublished();

  if (forms.length === 1) redirect(`/forms/${forms[0].slug}`);

  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh bg-ivory px-6 pb-20 pt-28">
        <div className="mx-auto max-w-[640px]">
          <h1 className="font-serif text-4xl font-semibold text-navy">Feedback forms</h1>
          {forms.length === 0 ? (
            <p className="mt-6 text-navy/60">No forms are open for responses right now.</p>
          ) : (
            <ul className="mt-10 flex flex-col gap-3">
              {forms.map((form) => (
                <li key={form.id}>
                  <Link
                    href={`/forms/${form.slug}`}
                    className="block rounded-2xl border border-navy/10 bg-white px-5 py-4 transition-colors hover:border-gold"
                  >
                    <p className="font-medium text-navy">{form.title}</p>
                    {form.description && (
                      <p className="mt-1 text-sm text-navy/60">{form.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
