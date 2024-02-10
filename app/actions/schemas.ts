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