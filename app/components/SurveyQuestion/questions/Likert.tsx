import type { Option } from '@/app/types';
import { QuestionTitle } from './components';
import styles from './questions.module.css';

const Likert = (
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
    const values = (
      Array.from(
        document.querySelectorAll(`input[name=${ id  }]:checked`)
      ) as HTMLInputElement[]
    )
      .map((e) => e?.value?.toString());

    if (values.length === 0) answeredCallback(null);
    answeredCallback(values);
  }

  return (
    <fieldset className={ styles.question_wrapper }>
      <QuestionTitle required={ required }>{ question_body }</QuestionTitle>
      <div className={ styles.likert_option_wrapper }>
      {
        options.map(({ option_id, option_text}) => {
          const unique_option_id: string = `${ id }_${ option_id }`;

          return (
            <div key={ unique_option_id }>
              <input
                type='radio'
                name={ id }
                value={ option_text }
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

export default Likert;