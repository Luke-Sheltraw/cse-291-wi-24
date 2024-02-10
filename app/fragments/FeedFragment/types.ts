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

export enum FeedVariant {
  NoContext,
  HumanContext,
  AutomatedContext,
}