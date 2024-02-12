import TimedButton from '../TimedButton';
import styles from './component.module.css';

const StartModal = ({ startAction }: { startAction: Function}) => {
  return (
    <>
      <div className={ styles.backdrop }></div>
      <dialog className={ styles.modal } open>
        <p>
          You will now view a series of social media posts.
        </p>
        <TimedButton
          timerLength={ 5 }
          buttonAction={ startAction }
        >Start</TimedButton>
      </dialog>
    </>
  );
}

export default StartModal