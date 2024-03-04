import styles from './fragment.module.css';

const ConfirmationFragment = () => {
  return (
    <>
    <p className={ styles.message }>
      Thank you for participating!
    </p>
    <p className={ styles.paragraph }>
      <strong className={ styles.warning }>Note: </strong>
      The posts shown in this study were constructed purely for the sake of research. You should <strong className={ styles.warning }>not</strong> take any information shown to be truthful.
    </p>
    <p className={ styles.paragraph }>
      Namely, Rachel Bernays and Lachlan Morgan are <strong className={ styles.warning }>wholly fabricated characters</strong>, and neither them nor any story involving them contain any reflection of or basis in actual events.
    </p>
    </>
  );
}

export default ConfirmationFragment;