import type { Metadata } from "next";
import { getServerCaller } from "@/lib/trpc/server";
import { FeedbackFormPage } from "@/modules/feedback/components/FeedbackFormPage";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caller = await getServerCaller();
  const form = await caller.forms.bySlug({ slug });

  if (!form) return { title: "Form not found" };

  return {
    title: form.title,
    description: form.description ?? undefined,
    robots: { index: false },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <FeedbackFormPage slug={slug} />;
}
