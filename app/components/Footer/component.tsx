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

const Footer = (
  { messageEnabled, messageDisabled, enabled, secondsLeft, continueAction }:
  {
    messageEnabled: string,
    messageDisabled: string,
    enabled: boolean,
    secondsLeft?: number,
    continueAction: Function,
  }
) => {
  return (
    <footer className={ styles.page_footer }>
      <p>
      { 
        enabled
        ? messageEnabled
        : messageDisabled
      }
      </p>
      <button
        className={ styles.nav_button }
        disabled={ !enabled }
        onClick={ () => continueAction() }
      >
        {
          !enabled &&
          secondsLeft &&
          secondsLeft > 0 &&
          <span role='timer' className={ styles.nav_countdown }>
            { formatSeconds(secondsLeft) }
          </span>
        }
        Continue
      </button>
    </footer>
  );
}

export default Footer;