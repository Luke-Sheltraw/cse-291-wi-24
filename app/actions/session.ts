'use server'

export const submitData = () => {
  console.log('submitted');
}

export const createUser = (): string | null => {
  return ''; // return new user id, or null if failure
}

export const startSessionByUserID = (userId: string): string | null => {
  return ''; // return new session id, or null if failure
}

export const endSessionBySessionID = (sessionId: string): boolean => {
  return false; // return success status
}

export const submitSurveyBySessionID = (sessionId: string): boolean => {
  return false; // return success status
}

export const getProgressBySessionID = (sessionId: string): any => {
  return { }; // return progress
}

export const getActiveSessionIDsByUserID = (userId: string): string[] => {
  return []; // return array of active session ids
}

export const getAllCompletedSessionIDs = (): string[] => {
  return []; // return array of all completed session ids
}

type Question = {
  question_id: string,
  question: string,
  response: string,
}

type Survey = {
  survey_id: string,
  question_ids: string[],
}

type Session = {
  session_id: string,
  completed: boolean,
  pre_survey_id: string | null,
  post_survey_id: string | null,
}

type User = {
  user_id: string,
  session_ids: string[],
}