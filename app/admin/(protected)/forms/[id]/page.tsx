import type { Metadata } from "next";
import { getServerCaller } from "@/lib/trpc/server";
import { ResponsesView } from "@/modules/admin/components/ResponsesView";
import { PublishButton } from "@/modules/admin/components/PublishButton";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Responses", robots: { index: false } };

export default async function FormResponsesPage({ params }: Props) {
  const { id } = await params;
  const caller = await getServerCaller();
  const { form, questions, responses } = await caller.adminForms.getWithResponses({ formId: id });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-navy">{form.title}</h1>
        {form.status === "draft" && <PublishButton formId={form.id} />}
      </div>
      <p className="mb-6 text-navy/50">
        /forms/{form.slug} &middot; {responses.length} response
        {responses.length === 1 ? "" : "s"}
      </p>
      <ResponsesView questions={questions} responses={responses} />
    </div>
  );
}
