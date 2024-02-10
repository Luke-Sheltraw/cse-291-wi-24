'use client'

import styles from './page.module.css';
import { useState } from 'react';
import { FeedFragment, SurveyFragment, ConfirmationFragment } from './fragments';
import { Fragment, type Question } from './types';
import pre_qs from './pre_questions.json';
import post_qs from './post_questions.json';

const preQuestions = pre_qs as Question[];
const postQuestions = post_qs as Question[];

export default function Home() {
  const [curFragment, setCurFragment] = useState<Fragment>(Fragment.PreSurvey);

  return (
    <main className={ styles.wrapper }>
      {
        (() => {
          switch (curFragment) {
            case Fragment.PreSurvey: return (
              <SurveyFragment
                nextFragment={ () => setCurFragment(Fragment.Feed) }
                questions={ preQuestions }
              />
            );
            case Fragment.Feed: return (
              <FeedFragment
                nextFragment={ () => setCurFragment(Fragment.PostSurvey) }
              />
            );
            case Fragment.PostSurvey: return (
              <SurveyFragment
                nextFragment={ () => setCurFragment(Fragment.Confirmation) }
                questions={ postQuestions }
              />
            );
            case Fragment.Confirmation: return (
              <ConfirmationFragment />
            );
            default: return null;
          }
        })()
      }
    </main>
  );
}
