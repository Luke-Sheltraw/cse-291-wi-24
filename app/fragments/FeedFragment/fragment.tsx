'use client'

import { type FeedPost } from '@/app/types';
import { MockPost } from './components';
import { useEffect, useState } from 'react';
import { Footer, StartModal } from '@/app/components';
import { FeedVariant } from '@/app/types';
import styles from './fragment.module.css';

const FeedFragment = (
  { nextFragment,
    feedVariant,
    postsPromise,
  }:
  {
    nextFragment: Function,
    feedVariant: FeedVariant | null,
    postsPromise: Promise<FeedPost[]> | null,
  }
) => {
  const [feedPosts, setFeedPosts] = useState<FeedPost[] | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showStartModal, setShowStartModal] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setFeedPosts(await postsPromise);
    })()

    return () => {

    } // TODO: make cancellable
  }, [postsPromise]);

  if (feedPosts === null || feedVariant === null) return null;

  const handleModalClose = () => {
    setTimerActive(true);
    setShowStartModal(false);
  }

  return (
    <>
      {
        showStartModal
        && <StartModal startAction={ handleModalClose } />
      }
      <section role='feed' className={ styles.content_feed }>
      {
        feedPosts.map((feedPost) => 
          <MockPost
            key={ feedPost.uid }  
            fp={ feedPost }
            feedVariant={ feedVariant }
          />
        )
      }
      </section>
      <Footer
        messageDisabled='Please continue reading the posts.'
        messageEnabled='You may proceed.'
        enabled={ timerActive }
        timerLength={ 15 }
        continueAction={ nextFragment }
      />
    </>
  );
}

export default FeedFragment;