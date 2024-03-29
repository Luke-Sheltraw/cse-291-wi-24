'use client'

import { Footer, SurveyQuestion, RequiredNote } from '@/app/components';
import { type Question } from '@/app/types';
import { submitSurvey } from '@/app/actions/session';
import { useEffect, useRef, useState } from 'react';
import styles from './fragment.module.css';

const SurveyFragment = (
  { nextFragment, surveyPostVariant, questionsPromise }:
  {
    nextFragment: Function,
    surveyPostVariant: 'pre-survey' | 'post-survey-one' | 'post-survey-two',
    questionsPromise: Promise<Question[]> | null,
  }
) => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const questionsAndResponses = useRef<{ [question: string]: string | string[] }>({});

  useEffect(() => {
    (async () => {
      setQuestions(await questionsPromise);
    })()

    return () => {

    } // TODO: make cancellable
  }, [questionsPromise]);

  if (questions === null) return null;

  const answeredCallback = (question: Question, answer: string | string[]) => {
    setAnsweredQuestions((curAnsweredQuestions) => {
      if (answer) {
        if (curAnsweredQuestions.includes(question.uid)) return curAnsweredQuestions;
        return [...curAnsweredQuestions, question.uid];
      } else {
        return curAnsweredQuestions.filter((curUid) => curUid !== question.uid);
      }
    });

    questionsAndResponses.current[question.question_body] = answer;
  }

  const getEnabledStatus = () => {
    return questions.every((q) =>
      !q.required ||
      answeredQuestions.includes(q.uid)
    );
  }

  const submitCallback = () => {
    const success = submitSurvey({
      type: surveyPostVariant,
      questions:
        Object.entries(questionsAndResponses.current)
        .map(([question, response]) => ({ question, response})),
    });

    if (!success) return;

    nextFragment();
  }

  return (
    <>
    <div className={ styles.survey_wrapper }>
      <section className={ styles.survey_main }>
      {
        questions.map((q: Question) => (
          <SurveyQuestion
            key={ q.uid }
            question={ q }
            answeredCallback={ (answer: string | string[]) => answeredCallback(q, answer) } 
          />
        ))
      }
      <RequiredNote />
      </section>
    </div>
    <Footer
        messageDisabled='Please answer all required questions.'
        messageEnabled='You may proceed'
        enabled={ getEnabledStatus() }
        continueAction={ submitCallback }
    />
    </>
  );
}

export default SurveyFragment;