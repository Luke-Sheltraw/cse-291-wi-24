'use client'

import { type FeedPost } from './types';
import { MockPost } from './components';
import { useEffect, useState } from 'react';
import { Footer } from '@/app/components';
import styles from './fragment.module.css';
import importedPosts from './posts.json';

const TIMER_LENGTH_SECS: number = 10;

const FeedFragment = ({ nextFragment }: { nextFragment: Function }) => {
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);

  const [secondsLeft, setSecondsLeft] = useState<number>(TIMER_LENGTH_SECS);

  useEffect(() => {
    const startTime = new Date().getTime();

    const updateTime = () => {
      const currentTime = new Date().getTime();

      setSecondsLeft(TIMER_LENGTH_SECS - Math.floor((currentTime - startTime) / 1000));
    }

    const timerInterval = setInterval(updateTime, 500);

    return () => {
      clearInterval(timerInterval);
    }
  },[]);

  useEffect(() => {
    setFeedPosts(importedPosts as FeedPost[]); // TODO: replace this with dynamic assignment
  }, []);

  return (
    <>
      <section role='feed' className={ styles.content_feed }>
      {
        feedPosts.map((feedPost) => 
          <MockPost
            key={ feedPost.uid }  
            fp={ feedPost }
          />
        )
      }
      </section>
      <Footer
        messageDisabled='Please continue reading the posts.'
        messageEnabled='You may proceed.'
        enabled={ secondsLeft <= 0 }
        secondsLeft={ secondsLeft }
        continueAction={ nextFragment }
      />
    </>
  );
}

export default FeedFragment;