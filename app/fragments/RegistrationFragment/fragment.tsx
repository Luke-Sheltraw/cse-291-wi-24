import { useRef, useState } from 'react';
import styles from './fragment.module.css';
import { FeedVariant, Fragment } from '@/app/types';
import { startSession, getProgress, getStudyVariant } from '@/app/actions/session';
import { PrimaryButton } from '@/app/components';

const RegistrationFragment = (
  {
    nextFragment,
    setCurFragment,
    setFeedVariant,
  }:
  {
    nextFragment: Function,
    setCurFragment: Function,
    setFeedVariant: Function,
  }
) => {
  const [dialogVariant, setDialogVariant] = useState<'register'|'progress'|'completed'>('register');
  const priorProgress = useRef<Fragment>();

  const handleAppStart = async () => {
    priorProgress.current = await getProgress();

    if (priorProgress.current === Fragment.Confirmation) {
      setDialogVariant('completed');
      return;
    } else if (priorProgress.current !== Fragment.Registration) {
      setDialogVariant('progress');
      return;
    }

    startApp();
  }

  const startApp = async () => {
    if (!(await startSession())) {
      console.error('Unable to start session');
      return;
    }

    await updateFeedVariant();
    nextFragment();
  }

  const updateFeedVariant = async () => {
    const feedVariant = await (async () => {
      switch(await getStudyVariant()) {
        case 'control': return FeedVariant.NoContext;
        case 'automated': return FeedVariant.AutomatedContext;
        case 'human': return FeedVariant.HumanContext;
        default: return null;
      }
    })();

    if (feedVariant === null) {
      console.error('Unable to start session');
      return;
    }

    setFeedVariant(feedVariant);
  }

  const handleAppContinue = async () => {
    await updateFeedVariant();
    setCurFragment(priorProgress.current ?? Fragment.Registration);
  }

  return (
    <section className={ styles.wrapper }>
    <h1 className={ styles.title }>Social Media Study</h1>
    {
      (() => { 
        switch (dialogVariant) {
          case 'register': return (<>
            <p className={ styles.message }>
              Thank you for your interest in participating in this study. You should expect to set aside 15 minutes.
            </p>
            <PrimaryButton
              onClick={ handleAppStart }
            >
              Begin
            </PrimaryButton>
          </>);
          case 'progress': return (<>
            <p className={ styles.message }>
              It looks like you have previous progress. You may restart or continue from where you left off.
            </p>
            <div className={ styles.button_wrapper }>
              <PrimaryButton
                onClick={ startApp }
              >
                Restart
              </PrimaryButton>
              <PrimaryButton
                onClick={ handleAppContinue }
              >
                Continue
              </PrimaryButton>
            </div>
          </>);
          case 'completed': return (<>
            <p className={ styles.message }>It looks like you have already completed the study. Thank you for your participation.</p>
          </>);
          default: return null;
        }
      })()
    }
    </section>
  ); 
}

export default RegistrationFragment;