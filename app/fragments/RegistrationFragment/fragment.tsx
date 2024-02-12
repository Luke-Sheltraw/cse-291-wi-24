import styles from './fragment.module.css';
import { startSession } from '@/app/actions/session';

const RegistrationFragment = ({ nextFragment }: { nextFragment: Function }) => {
  const handleAppStart = async () => {
    const session_id = await startSession();

    if (!session_id) {
      console.error('Unable to start session');
      return;
    }

    document.cookie = `session_id=${ session_id }`;

    nextFragment();
  }

  return (
    <section className={ styles.wrapper }>
      <h1 className={ styles.title }>Social Media Study</h1>
      <p className={ styles.message }>
        Thank you for your interest in participating in this study. You should expect to set aside 15 minutes.
      </p>
      <button
        className='primary_button'
        onClick={ handleAppStart }
      >
        Begin
      </button>
    </section>
  );
}

export default RegistrationFragment;