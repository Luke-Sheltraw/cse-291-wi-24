export type Question = {
  uid: string,
  question_type: 'mcq_many' | 'mcq_single' | 'text_frq' | 'number_frq' | 'likert',
  question_body: string,
  options?: Option[], 
  required: boolean,
}

export type Option = {
  option_text: string,
  option_id: string
}

export enum Fragment {
  Registration,
  PreSurvey,
  Feed,
  PostSurvey,
  Confirmation
}