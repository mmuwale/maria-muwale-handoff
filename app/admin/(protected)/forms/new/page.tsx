import type { Metadata } from "next";
import { CreateFormForm } from "@/modules/admin/components/CreateFormForm";

export const metadata: Metadata = { title: "New form", robots: { index: false } };

export default function NewFormPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-navy">New form</h1>
      <CreateFormForm />
    </div>
  );
}
