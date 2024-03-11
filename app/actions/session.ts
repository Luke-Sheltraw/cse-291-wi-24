'use server'

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Fragment } from '@/app/types';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const startSession = async (): Promise<boolean> => {
  /* Delete existing session if exists and is incomplete */
  if (cookies().has('session_id')) {
    const { data } = await supabase
      .from('Sessions')
      .select()
      .eq('id', cookies().get('session_id')?.value);

    if (data?.[0]?.pre_survey_id && data?.[0]?.post_survey_one_id && data?.[0]?.post_survey_two_id) {
      console.error('Cannot replace completed session');
      return false;
    }

    await supabase
      .from('Sessions')
      .delete()
      .eq('id', cookies().get('session_id')?.value);

    cookies().delete('session_id');
  }

  /* Create new session with variant */
  const variant = await chooseStudyVariant();

  const { data, error } = await supabase
    .from('Sessions')
    .insert({ variant })
    .select();

  const session_id = data?.[0]?.id;

  /* Return success status and assign cookie */
  if (error || !session_id) {
    console.log('Error creating new sesion', error);
    return false;
  }

  cookies().set('session_id', session_id);
  return true;
}

const chooseStudyVariant = async (): Promise<'control' | 'human' | 'automated'> => {
  /* Get existing counts of three variants of study */
  const controlCount = (await supabase
    .from('Sessions')
    .select('*', { count: 'exact', head: true })
    .eq('variant', 'control'))
    ?.count ?? 0;

  const humanCount = (await supabase
    .from('Sessions')
    .select('*', { count: 'exact', head: true })
    .eq('variant', 'human'))
    ?.count ?? 0;

  const automatedCount = (await supabase
    .from('Sessions')
    .select('*', { count: 'exact', head: true })
    .eq('variant', 'automated'))
    ?.count ?? 0;

  /* Assign minimum of three three*/
  const minCountValue = Math.min(
    controlCount,
    humanCount,
    automatedCount,
  );

  if (controlCount === minCountValue) {
    return 'control';
  } else if (humanCount === minCountValue) {
    return 'human';
  } else {
    return 'automated';
  }
}

export const getStudyVariant = async (): Promise<'control' | 'human' | 'automated' | null> => {
  const session_id = cookies().get('session_id')?.value;

  if (!session_id) {
    console.error('No session associated with request');
    return null;
  }

  const { data, error } = await supabase
    .from('Sessions')
    .select()
    .eq('id', session_id);

  if (error) {
    console.error('Error fetching study variant');
    return null;
  }

  return data?.[0]?.variant ?? null;
}

export const submitSurvey = async ({
  type,
  questions,
}: {
  type: 'pre-survey' | 'post-survey-one' | 'post-survey-two',
  questions: {
    question: string,
    response: string | string[],
  }[]
}): Promise<boolean> => {
  /* Validate session */
  const session_id = cookies().get('session_id')?.value;
  if (!session_id) {
    console.error('No session associated with request');
    return false;
  }

  /* Validate format of input */
  if (
    !(type === 'pre-survey' || type === 'post-survey-one' || type === 'post-survey-two')
    || !questions.every((q) => 
      (
        Object.keys(q).length === 2
        && typeof q.question === 'string'
        && (typeof q.response === 'string' || Array.isArray(q.response))
      )
    )
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
        (() => {
          switch (type) {
            case 'pre-survey': return 'pre_survey_id';
            case 'post-survey-one': return 'post_survey_one_id';
            case 'post-survey-two': return 'post_survey_two_id';
          }
        })()
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
  /* Return fragment corresponding the first incomplete section */
  const session_id = cookies().get('session_id')?.value;

  if (!session_id) return Fragment.Registration;

  const { data, error } = await supabase
    .from('Sessions')
    .select()
    .eq('id', session_id);

  if (error) {
    console.error('Error retrieving progress');
    return Fragment.Registration;
  }

  if (!data?.[0]?.pre_survey_id) return Fragment.Registration;
  else if (!data?.[0]?.post_survey_one_id) return Fragment.Feed;
  else if (!data?.[0]?.post_survey_two_id) return Fragment.PostSurveyTwo;
  else return Fragment.Confirmation;
}

export const getConfigValue = async (key: string): Promise<any> => {
  const { data, error } = await supabase
    .from('Configuration')
    .select()
    .eq('key', key);

  if (error) {
    console.error('Error retrieving configuration value');
    return;
  };

  return data?.[0]?.value ?? null;
}

export const getResponsesPerQuestionByVariant = async (variant: string): Promise<any> => {
  const { data, error } = await supabase
    .from('Sessions')
    .select(`
      variant,
      pre_survey_id (
        questions
      ),
      post_survey_one_id (
        questions
      ),
      post_survey_two_id (
        questions
      )
    `)
    .eq('variant', variant);

  if (error || !data) return 'Error';

  const cleanedData = data.map((entry) => ([
    // @ts-ignore
    ...entry.pre_survey_id?.questions,
    // @ts-ignore
    ...entry.post_survey_one_id?.questions,
    // @ts-ignore
    ...entry.post_survey_two_id?.questions,
  ]));

  const aggregatedData: { [key: string]: any } = {};

  cleanedData.forEach((entry) => {
    const questionsResponses = entry;
    questionsResponses.forEach(({ question, response }: { question: string, response: string | string[] }) => {
      if (!aggregatedData[question]) {
        aggregatedData[question] = [];
      }

      const responseValue = Array.isArray(response) ? response.join(', ') : response;
      aggregatedData[question].push(`"${ responseValue }"`);
    });
  });

  return aggregatedData;
}