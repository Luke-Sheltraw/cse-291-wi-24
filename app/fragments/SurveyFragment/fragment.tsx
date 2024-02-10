'use client'

import { Footer, SurveyQuestion, RequiredNote } from '@/app/components';
import { type Question } from '@/app/types';
import { submitData } from '@/app/actions/session';
import { useState } from 'react';
import styles from './fragment.module.css';

const SurveyFragment = (
  { nextFragment, questions }:
  { nextFragment: Function, questions: Question[] }
) => {
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const answeredCallback = (uid: string, answered: boolean) => {
    setAnsweredQuestions((curAnsweredQuestions) => {
      if (answered) {
        if (curAnsweredQuestions.includes(uid)) return curAnsweredQuestions;
        return [...curAnsweredQuestions, uid];
      } else {
        return curAnsweredQuestions.filter((curUid) => curUid !== uid);
      }
    });
  }

  const getEnabledStatus = () => {
    return questions.every((q) =>
      !q.required ||
      answeredQuestions.includes(q.uid)
    );
  }

  const submitCallback = () => {
    submitData();
    nextFragment();
  }

  return (
    <>
    <div className={ styles.survey_wrapper }>
      <main className={ styles.survey_main }>
      {
        questions.map((q: Question) => (
          <SurveyQuestion
            key={ q.uid }
            question={ q }
            answeredCallback={ (answered: boolean) => answeredCallback(q.uid, answered) } 
          />
        ))
      }
      <RequiredNote />
      </main>
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