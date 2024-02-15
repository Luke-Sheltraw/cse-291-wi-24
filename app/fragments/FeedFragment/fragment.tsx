'use client'

import { type FeedPost } from './types';
import { MockPost } from './components';
import { useEffect, useState } from 'react';
import { Footer, StartModal } from '@/app/components';
import { FeedVariant } from '@/app/types';
import styles from './fragment.module.css';
import importedPosts from './posts.json';

const FeedFragment = (
  { nextFragment,
    feedVariant,
  }:
  {
    nextFragment: Function,
    feedVariant: FeedVariant | null,
  }
) => {
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showStartModal, setShowStartModal] = useState<boolean>(true);

  useEffect(() => {
    setFeedPosts(importedPosts as FeedPost[]); // TODO: replace this with dynamic assignment
  }, []);

  if (feedVariant === null) return null;

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