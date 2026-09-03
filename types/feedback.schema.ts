import { z } from "zod";
import { QUESTION_TYPES } from "@/lib/db/schema/form-questions";

/** One answer submitted for one question. `value` shape depends on the question type. */
export const answerInputSchema = z.object({
  questionId: z.string().min(1),
  value: z.union([z.string(), z.array(z.string())]),
});
export type AnswerInput = z.infer<typeof answerInputSchema>;

/** The payload the public form page sends when a respondent submits. */
export const submitResponseSchema = z.object({
  formId: z.string().min(1),
  answers: z.array(answerInputSchema).min(1, "Answer at least one question."),
});
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;

export const questionTypeSchema = z.enum(QUESTION_TYPES);

/** One question in a form-creation payload. Options are required for the
 *  choice-like types and validated together with the type in the router. */
export const createQuestionSchema = z.object({
  type: questionTypeSchema,
  question: z.string().min(1),
  description: z.string().optional(),
  isRequired: z.boolean().default(false),
  options: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).optional(),
});
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export const createFormSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  description: z.string().optional(),
  allowAnonymous: z.boolean().default(true),
  questions: z.array(createQuestionSchema).min(1, "Add at least one question."),
});
export type CreateFormInput = z.infer<typeof createFormSchema>;
