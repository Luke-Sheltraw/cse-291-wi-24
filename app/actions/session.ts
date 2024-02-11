'use server'

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_KEY ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const createUser = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from("Users")
    .insert({})
    .select();

  if (error) {
    console.error('Error creating user');
    return null;
  }

  return data?.[0]?.id ?? null; // return new user id, or null if failure
}

export const startSession = async (): Promise<string | null> => {
  const user_id = cookies().get('user_id')?.value;

  if (!user_id) {
    console.error('Error fetching user ID');
    return null;
  }

  const { data, error } = await supabase
    .from("Sessions")
    .insert({})
    .select();

  const res = await supabase
    .from("Users")
    .update({ session_ids: [data?.[0]?.id] })
    .eq('id', user_id);

  return data?.[0]?.id ?? null; // return new session id, or null if failure
}

export const endSessionBySessionID = async (sessionId: string): Promise<boolean> => {
  return false; // return success status
}

export const submitSurveyBySessionID = async (sessionId: string): Promise<boolean> => {
  return false; // return success status
}

export const getProgressBySessionID = async (sessionId: string): Promise<any> => {
  return { }; // return progress
}

export const getActiveSessionIDsByUserID = async (userId: string): Promise<string[]> => {
  return []; // return array of active session ids
}

export const getAllCompletedSessionIDs = async (): Promise<string[]> => {
  return []; // return array of all completed session ids
}