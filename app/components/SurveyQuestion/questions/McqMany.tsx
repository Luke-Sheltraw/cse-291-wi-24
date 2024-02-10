import styles from './questions.module.css';
import { QuestionTitle } from './components';
import type { Option } from '@/app/types';

const McqMany = (
  { question_body, options, id, required, answeredCallback }:
  {
    question_body: string,
    options: Option[],
    id: string,
    required: boolean,
    answeredCallback: Function,
  }
) => {

  const inputCallback = (e: any) => {
    answeredCallback(document.querySelectorAll(`input[name=${ id  }]:checked`).length > 0);
  }

  return (
    <fieldset className={ styles.question_wrapper }>
      <QuestionTitle required={ required }>
        { question_body }
        <span className={ styles.select_all_note }> (Select all that apply)</span>
      </QuestionTitle>
      <div className={ styles.multi_option_wrapper }>
      {
        options.map(({ option_id, option_text}) => {
          const unique_option_id: string = `${ id }_${ option_id }`;

          return (
            <div key={ unique_option_id }>
              <input
                type='checkbox'
                name={ id }
                value={ unique_option_id }
                id={ unique_option_id }
                onInput={ inputCallback }
              />
              <label htmlFor={ unique_option_id }>{ option_text }</label>
            </div>
          );
        })
      }
      </div>
    </fieldset>
  );
}

export default McqMany;