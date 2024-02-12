'use server'

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Fragment } from '@/app/types';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const startSession = async (): Promise<boolean> => {
  if (cookies().has('session_id')) {
    await supabase
      .from('Sessions')
      .delete()
      .eq('id', cookies().get('session_id'));

    cookies().delete('session_id');
  }

  const { data, error } = await supabase
    .from('Sessions')
    .insert({})
    .select();

  const session_id = data?.[0]?.id;

  if (error || !session_id) {
    console.log('Error creating new sesion', error);
    return false;
  }

  cookies().set('session_id', session_id);
  return true; // return success status
}

export const submitSurvey = async ({
  type,
  questions,
}: {
  type: 'pre-survey' | 'post-survey',
  questions: {
    question: string,
    response: string | string[],
  }[]
}): Promise<boolean> => {
  /* Validate session */
  const session_id = cookies().get('session_id')?.value;
  if (!session_id) {
    console.error('No session associated to survey submission');
    return false;
  }

  /* Validate format of input */
  if (
    !(type === 'pre-survey' || type === 'post-survey')
    || !questions.every((q) => {
      return (
        Object.keys(q).length === 2
        && typeof q.question === 'string'
        && (typeof q.response === 'string' || Array.isArray(q.response))
      );
    })
  ) {
    console.error('Malformed survey input');
    return false;
  }


  /* Submit survey */
  const surveyResponse = await supabase
    .from('Surveys')
    .insert({ questions })
    .select();

  if (surveyResponse?.error) {
    console.error('Error submitting survey', surveyResponse?.error);
    return false;
  }

  /* Attach survey to session */
  const sessionResponse = await supabase
    .from('Sessions')
    .update({
      [
        type === 'pre-survey'
        ? 'pre_survey_id'
        : 'post_survey_id'
      ]: surveyResponse.data?.[0]?.id,
    })
    .eq('id', session_id);
  
  if (sessionResponse?.error) {
    console.error('Error attaching survey to session', sessionResponse?.error);
    return false;
  }

  /* All sucessful */
  return true;
}

export const getProgress = async (): Promise<Fragment> => {
  const session_id = cookies().get('session_id')?.value;

  if (!session_id) return Fragment.Registration;

  const { data, error } = await supabase
    .from('Sessions')
    .select()
    .eq('id', session_id);

  if (error) {
    console.error('Error retrieving progress from session ID');
    return Fragment.Registration;
  }

  if (data?.[0]?.pre_survey_id === null) return Fragment.Registration;
  else if (data?.[0]?.post_survey_id === null) return Fragment.Feed;
  else return Fragment.Confirmation;
}