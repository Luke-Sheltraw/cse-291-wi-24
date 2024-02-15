'use client'

import styles from './page.module.css';
import { useState } from 'react';
import {
  FeedFragment,
  SurveyFragment,
  ConfirmationFragment,
  RegistrationFragment,
} from './fragments';
import { FeedVariant, Fragment, type Question } from './types';
import pre_qs from './pre_questions.json';
import post_qs from './post_questions.json';

const preQuestions = pre_qs as Question[];
const postQuestions = post_qs as Question[];

export default function Home() {
  const [curFragment, setCurFragment] = useState<Fragment>(Fragment.Registration);
  const [feedVariant, setFeedVariant] = useState<FeedVariant | null>(null);

  return (
    <main className={ styles.wrapper }>
      {
        (() => {
          switch (curFragment) {
            case Fragment.Registration: return (
              <RegistrationFragment
                nextFragment={ () => setCurFragment(Fragment.PreSurvey) }
                setCurFragment={ setCurFragment }
                setFeedVariant={ setFeedVariant }
              />
            );
            case Fragment.PreSurvey: return (
              <SurveyFragment
                nextFragment={ () => setCurFragment(Fragment.Feed) }
                surveyPostVariant='pre-survey'
                questions={ preQuestions }
              />
            );
            case Fragment.Feed: return (
              <FeedFragment
                nextFragment={ () => setCurFragment(Fragment.PostSurvey) }
                feedVariant={ feedVariant }
              />
            );
            case Fragment.PostSurvey: return (
              <SurveyFragment
                nextFragment={ () => setCurFragment(Fragment.Confirmation) }
                surveyPostVariant='post-survey'
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
