'use client'

import { useState, useEffect } from 'react';
import { getResponsesPerQuestionByVariant } from '@/app/actions/session';
import styles from './styles.module.css';

const ResponsesPage = (
  { params: { variant } }:
  { params: { variant: string }}
) => {
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    (async () => {
      setResponse(await getResponsesPerQuestionByVariant(variant));
    })()
  }, []);

  if (!response) return;

  return (
    <textarea className={ styles.large_textarea }>
      { 
        Object.entries(response).map(([question, answer]) =>
          (
            `${ question },${ `${ answer?.toString() }` }`
          )
        ).join('\n')
      }
    </textarea>
  );
}

export default ResponsesPage;