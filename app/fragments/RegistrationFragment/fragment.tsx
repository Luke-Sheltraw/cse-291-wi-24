import styles from './fragment.module.css';
import { createUser, startSession } from '@/app/actions/session';

const RegistrationFragment = ({ nextFragment }: { nextFragment: Function }) => {
  const handleAppStart = async () => {
    const user_id = await createUser();
    if (!user_id) {
      console.error('Unable to create new user.');
      return;
    }

    document.cookie = `user_id=${ user_id }`;

    const session_id = await startSession();

    console.log(session_id);

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