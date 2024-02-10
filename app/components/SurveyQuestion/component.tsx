import type { Question } from '@/app/types';
import { Likert, McqMany, McqSingle, NumberFrq, TextFrq } from './questions';

const SurveyQuestion = ({ question, answeredCallback }: { question: Question, answeredCallback: Function }) => {
  const props = {
    question_body: question.question_body,
    options: question.options ?? [],
    id: question.uid,
    required: question.required,
    answeredCallback: answeredCallback
  }

  switch (question.question_type) {
    case 'mcq_many': return <McqMany { ...props } />
    case 'mcq_single': return <McqSingle { ...props } />
    case 'text_frq': return <TextFrq { ...props } />
    case 'number_frq': return <NumberFrq { ...props } />
    case 'likert': return <Likert { ...props } />
    default: return null;
  }
};

export default SurveyQuestion;
