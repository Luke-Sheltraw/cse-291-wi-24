import styles from './component.module.css';

const RequiredNote = () => {
  return (
    <p className={ styles.note }>
      <span className={ styles.symbol }>*</span> Indicates a required question
    </p>
  );
}

export default RequiredNote;