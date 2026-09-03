import type { getFormWithResponses } from "@/services/forms/getFormWithResponses";

type Data = Awaited<ReturnType<typeof getFormWithResponses>>;

function formatValue(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.join(", ");
  } catch {
    // not JSON - plain scalar value
  }
  return raw;
}

/** Anonymous by construction: nothing here identifies who answered - see
 *  form-responses.ts. Only what was said, and when. */
export function ResponsesView({ questions, responses }: Pick<Data, "questions" | "responses">) {
  if (responses.length === 0) {
    return <p className="text-navy/60">No responses yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy/10">
            <th className="px-4 py-3 font-semibold text-navy/60">Submitted</th>
            {questions.map((q) => (
              <th key={q.id} className="px-4 py-3 font-semibold text-navy/60">
                {q.question}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => {
            const answerByQuestion = new Map(
              response.answers.map((a) => [a.questionId, a.value]),
            );
            return (
              <tr key={response.id} className="border-b border-navy/5 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-navy/50">
                  {response.submittedAt?.toLocaleString() ?? "-"}
                </td>
                {questions.map((q) => (
                  <td key={q.id} className="px-4 py-3 text-navy">
                    {answerByQuestion.has(q.id)
                      ? formatValue(answerByQuestion.get(q.id)!)
                      : <span className="text-navy/30">-</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
