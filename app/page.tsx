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
import { checkIfUserAgentIsMobile} from '@/app/helpers';

export default function Home() {
  const [curFragment, setCurFragment] = useState<Fragment>(Fragment.Registration);
  const [feedVariant, setFeedVariant] = useState<FeedVariant | null>(null);

  const [postsPromise, setPostsPromise] = useState<Promise<FeedPost[]> | null>(null);
  const [preQuestionsPromise, setPreQuestionsPromise] = useState<Promise<Question[]> | null>(null);
  const [postQuestionsOnePromise, setPostQuestionsOnePromise] = useState<Promise<Question[]> | null>(null);
  const [postQuestionsTwoPromise, setPostQuestionsTwoPromise] = useState<Promise<Question[]> | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const isMobileCheck = checkIfUserAgentIsMobile();
    setIsMobile(isMobileCheck);
    if (isMobileCheck) return;

    setPostsPromise(getConfigValue('posts'));
    setPreQuestionsPromise(getConfigValue('pre_questions'));
    setPostQuestionsOnePromise(getConfigValue('post_questions_one'));
    setPostQuestionsTwoPromise(getConfigValue('post_questions_two'));
  }, []);

  if (isMobile) {
    return (
      <p>
        Thank you for your interest in participating in this study. It appears you are accessing this site from a mobile device. Please restart on a laptop or desktop computer. Thank you.
      </p>
    );
  }

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
                key='pre-survey'
                questionsPromise={ preQuestionsPromise }
              />
            );
            case Fragment.Feed: return (
              <FeedFragment
                nextFragment={ () => setCurFragment(Fragment.PostSurveyOne) }
                feedVariant={ feedVariant }
                postsPromise={ postsPromise }
              />
            );
            case Fragment.PostSurveyOne: return (
              <SurveyFragment
                nextFragment={ () => setCurFragment(Fragment.PostSurveyTwo) }
                surveyPostVariant='post-survey-one'
                key='post-survey-one'
                questionsPromise={ postQuestionsOnePromise }
              />
            );
            case Fragment.PostSurveyTwo: return (
              <SurveyFragment
                nextFragment={ () => setCurFragment(Fragment.Confirmation) }
                surveyPostVariant='post-survey-two'
                key='post-survey-two'
                questionsPromise={ postQuestionsTwoPromise }
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
