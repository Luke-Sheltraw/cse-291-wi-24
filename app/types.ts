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
  PostSurveyOne,
  PostSurveyTwo,
  Confirmation,
}

export enum FeedVariant {
  NoContext,
  HumanContext,
  AutomatedContext,
}

export type FeedPost = {
  uid: string,
  username: string,
  full_name: string,
  date: string,
  time: string,
  views: string,
  num_comments: string,
  num_reposts: string,
  num_likes: string,
  num_bookmarks: string,
  post_body: string,
  context_note: string | null,
}