import { create } from "zustand";

type AnswerValue = string | string[];

type AnswersState = {
  answers: Record<string, AnswerValue>;
  setAnswer: (questionId: string, value: AnswerValue) => void;
};

/**
 * A fresh store per form instance (created with useState/useMemo in the
 * component, not a module-level singleton), so two forms rendered at once
 * never share answers.
 */
export function createAnswersStore() {
  return create<AnswersState>((set) => ({
    answers: {},
    setAnswer: (questionId, value) =>
      set((state) => ({
        answers: { ...state.answers, [questionId]: value },
      })),
  }));
}

export type AnswersStore = ReturnType<typeof createAnswersStore>;
