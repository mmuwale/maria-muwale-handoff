import type { PublishedFormQuestion } from "@/services/forms/getPublishedFormBySlug";
import { TextQuestion } from "./questions/TextQuestion";
import { TextareaQuestion } from "./questions/TextareaQuestion";
import { NumberQuestion } from "./questions/NumberQuestion";
import { DateQuestion } from "./questions/DateQuestion";
import { YesNoQuestion } from "./questions/YesNoQuestion";
import { RatingQuestion } from "./questions/RatingQuestion";
import { ScaleQuestion } from "./questions/ScaleQuestion";
import { SingleChoiceQuestion } from "./questions/SingleChoiceQuestion";
import { MultipleChoiceQuestion } from "./questions/MultipleChoiceQuestion";

type AnswerValue = string | string[];

/** Routes a question to its type-specific input. Adds no behavior of its own. */
export function QuestionField({
  question,
  value,
  onChange,
}: {
  question: PublishedFormQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}) {
  const stringValue = typeof value === "string" ? value : "";
  const arrayValue = Array.isArray(value) ? value : [];

  switch (question.type) {
    case "text":
      return <TextQuestion value={stringValue} onChange={onChange} />;
    case "textarea":
      return <TextareaQuestion value={stringValue} onChange={onChange} />;
    case "number":
      return <NumberQuestion value={stringValue} onChange={onChange} />;
    case "date":
      return <DateQuestion value={stringValue} onChange={onChange} />;
    case "yes_no":
      return <YesNoQuestion value={stringValue} onChange={onChange} />;
    case "rating":
      return <RatingQuestion value={stringValue} onChange={onChange} />;
    case "scale":
      return (
        <ScaleQuestion question={question} value={stringValue} onChange={onChange} />
      );
    case "single_choice":
      return (
        <SingleChoiceQuestion
          question={question}
          value={stringValue}
          onChange={onChange}
        />
      );
    case "multiple_choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          value={arrayValue}
          onChange={onChange}
        />
      );
  }
}
