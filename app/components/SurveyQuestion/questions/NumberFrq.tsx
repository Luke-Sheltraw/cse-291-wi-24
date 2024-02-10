import { QuestionTitle } from './components';
import styles from './questions.module.css';

const NumberFrq = (
  { question_body, id, required, answeredCallback }:
  {
    question_body: string,
    id: string,
    required: boolean,
    answeredCallback: Function,
  }
) => {
  
  const inputCallback = (e: any) => {
    answeredCallback(e.target?.value?.length > 0);
  }

  return (
    <fieldset className={ styles.question_wrapper }>
      <QuestionTitle required={ required } id={ id }>{ question_body }</QuestionTitle>
      <input
        type='number'
        name={ id }
        onInput={ inputCallback }
        aria-labelledby={ id }
      />
    </fieldset>
  );
}

export default NumberFrq;