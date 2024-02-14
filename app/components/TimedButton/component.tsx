import { useEffect, useRef, useState } from 'react';
import { PrimaryButton } from '@/app/components';
import styles from './component.module.css';

function padZeros(value: string): string {
  return value.length == 1
    ? `0${ value }`
    : value;
}

function formatSeconds(seconds: number): string {
  return `${
    padZeros(Math.floor(seconds / 60).toString())
  }:${
    padZeros((seconds % 60).toString())
  }`;
}

const TimedButton = (
  { children, timerLength, buttonAction, activeCallback, disabled }:
  {
    children: React.ReactNode,
    timerLength: number,
    disabled?: boolean,
    buttonAction: Function,
    activeCallback?: Function
  }
) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(timerLength);
  const [targetDuration, setTargetDuration] = useState<number>(timerLength);

  const startTime = useRef<number>(new Date().getTime());

  useEffect(() => {
    if (disabled) return;

    setTargetDuration(secondsLeft);
    startTime.current = new Date().getTime();
  
    const updateTime = () => {
      const currentTime = new Date().getTime();
      const newSecondsLeft = targetDuration - Math.floor((currentTime - startTime.current) / 1000);

      setSecondsLeft(newSecondsLeft);
      if (newSecondsLeft <= 0) activeCallback?.();
    }

    const timerInterval = setInterval(updateTime, 500);

    return () => {
      clearInterval(timerInterval);
    }
  },[activeCallback, disabled, secondsLeft, targetDuration]);

  const handleButtonClick = () => {
    if (secondsLeft <= 0) buttonAction();
  }

  return (
    <PrimaryButton
      disabled={ secondsLeft > 0 }
      onClick={ handleButtonClick }
    >
      {
        secondsLeft > 0 &&
        <span role='timer' className={ styles.nav_countdown }>
          { formatSeconds(secondsLeft) }
        </span>
      }
      { children }
    </PrimaryButton>
  );
}

export default TimedButton;