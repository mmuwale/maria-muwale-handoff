import { notFound } from "next/navigation";
import { getServerCaller } from "@/lib/trpc/server";
import { SiteHeader } from "@/components/SiteHeader";
import { FormRenderer } from "./FormRenderer";

export async function FeedbackFormPage({ slug }: { slug: string }) {
  const caller = await getServerCaller();
  const form = await caller.forms.bySlug({ slug });

  if (!form) notFound();

  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh bg-ivory px-6 pb-20 pt-28">
        <div className="mx-auto max-w-[640px]">
          <h1 className="font-serif text-4xl font-semibold text-navy">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-3 text-navy/70">{form.description}</p>
          )}
          <div className="mt-10">
            <FormRenderer form={form} />
          </div>
        </div>
      </main>
    </>
  );
}
