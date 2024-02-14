import { useState } from 'react';
import { LoadingIcon } from '@/app/icons';
import styles from './component.module.css';

const PrimaryButton = (
  { children, disabled, onClick }:
  { children: React.ReactNode, disabled?: boolean, onClick?: Function }
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleButtonClick = () => {
    if (!onClick || isLoading) return;
    setIsLoading(true);
    onClick();
  }

  return (
    <button
      className={ styles.primary_button }
      disabled={ disabled }
      onClick={ handleButtonClick }
    >
      {
        isLoading
        ? <LoadingIcon />
        : children
      }
    </button>
  );
}

export default PrimaryButton;