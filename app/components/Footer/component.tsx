import { TimedButton, PrimaryButton } from '@/app/components';
import styles from './component.module.css';
import { useState } from 'react';

const Footer = (
  { messageEnabled, messageDisabled, enabled, timerLength, continueAction }:
  {
    messageEnabled: string,
    messageDisabled: string,
    enabled?: boolean,
    timerLength?: number,
    continueAction: Function,
  }
) => {
  const [timerLock, setTimerLock] = useState<boolean>(!!timerLength);

  return (
    <footer className={ styles.page_footer }>
      <p>
      { 
        (enabled !== false && !timerLock)
        ? messageEnabled
        : messageDisabled
      }
      </p>
      {
        timerLength
        ?
          <TimedButton
            timerLength={ timerLength }
            buttonAction={ continueAction }
            disabled={ !enabled }
            activeCallback={ () => setTimerLock(false) }
          >
            Continue
          </TimedButton>
        :
          <PrimaryButton
            disabled={ !enabled }
            onClick={ continueAction }
          >
            Continue
          </PrimaryButton>
      }
    </footer>
  );
}

export default Footer;