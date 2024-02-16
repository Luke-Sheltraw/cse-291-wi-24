'use client'

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import {
  FeedFragment,
  SurveyFragment,
  ConfirmationFragment,
  RegistrationFragment,
} from './fragments';
import { getConfigValue } from '@/app/actions/session';
import { FeedVariant, Fragment, type Question, type FeedPost } from './types';

export default function Home() {
  const [curFragment, setCurFragment] = useState<Fragment>(Fragment.Registration);
  const [feedVariant, setFeedVariant] = useState<FeedVariant | null>(null);

  const [postsPromise, setPostsPromise] = useState<Promise<FeedPost[]> | null>(null);
  const [preQuestionsPromise, setPreQuestionsPromise] = useState<Promise<Question[]> | null>(null);
  const [postQuestionsPromise, setPostQuestionsPromise] = useState<Promise<Question[]> | null>(null);

  useEffect(() => {
    setPostsPromise(getConfigValue('posts'));
    setPreQuestionsPromise(getConfigValue('pre_questions'));
    setPostQuestionsPromise(getConfigValue('post_questions'));
  }, []);

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
                questionsPromise={ preQuestionsPromise }
              />
            );
            case Fragment.Feed: return (
              <FeedFragment
                nextFragment={ () => setCurFragment(Fragment.PostSurvey) }
                feedVariant={ feedVariant }
                postsPromise={ postsPromise }
              />
            );
            case Fragment.PostSurvey: return (
              <SurveyFragment
                nextFragment={ () => setCurFragment(Fragment.Confirmation) }
                surveyPostVariant='post-survey'
                questionsPromise={ postQuestionsPromise }
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
