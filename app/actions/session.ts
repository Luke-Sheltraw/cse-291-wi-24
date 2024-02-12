'use server'

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const startSession = async (): Promise<string | null> => {
  if (cookies().has('session_id')) {
    console.error('User already has session');
    return null;
  }

  const { data, error } = await supabase
    .from('Sessions')
    .insert({})
    .select();

  if (error) {
    console.log('Error creating new sesion');
    return null;
  }

  const session_id = data?.[0].id ?? null;

  return session_id; // return new session id, or null if failure
}

export const submitSurvey = async ({
  type,
  questions,
}: {
  type: 'pre-survey' | 'post-survey',
  questions: {
    question: string,
    response: string,
  }[]
}): Promise<boolean> => {
  const session_id = cookies().get('session_id')?.value;

  if (!session_id) return false;

  if (
    !(type === 'pre-survey' || type === 'post-survey')
    || !questions.every((q) => {
      return (
        Object.keys(q).length === 2
        && typeof q.question === 'string'
        && typeof q.response === 'string'
      );
    })
  ) return false;

  const surveyResponse = await supabase
    .from('Surveys')
    .insert({ questions })
    .select();

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
    console.error('Error submitting survey', sessionResponse?.error);
    return false;
  }

  return true; // return success status
}

export const getProgress = async (): Promise<any> => {
  return { }; // return progress
}