import { type FeedPost } from '../../types';
import { FeedVariant } from '@/app/types';
import styles from './component.module.css';
import {
  MoreIcon,
  ReplyIcon,
  BookmarkIcon,
  LikeIcon,
  RepostIcon,
  ShareIcon,
  ViewsIcon,
  UsersIcon,
} from '@/app/icons';

const CONTEXT_SUBTEXT_HUMAN: string = 'Context is written by people who use X, and appears when rated helpful by others.';
const CONTEXT_SUBTEXT_AUTOMATED: string = 'Context has been provided by our automated system.';

const CONTEXT_TITLE_HUMAN: string = 'Readers added context they thought people might want to know';
const CONTEXT_TITLE_AUTOMATED: string = 'Our automated system added context people might want to know';

function getContextSubtextByFeedVariant(feedVariant: FeedVariant): string {
  switch (feedVariant) {
    case FeedVariant.HumanContext: return CONTEXT_SUBTEXT_HUMAN;
    case FeedVariant.AutomatedContext: return CONTEXT_SUBTEXT_AUTOMATED;
  }
  return '';
}

function getContextTitleByFeedVariant(feedVariant: FeedVariant): string {
  switch (feedVariant) {
    case FeedVariant.HumanContext: return CONTEXT_TITLE_HUMAN;
    case FeedVariant.AutomatedContext: return CONTEXT_TITLE_AUTOMATED;
  }
  return '';
}

const MockPost = ({
  fp,
  feedVariant,
}: {
  fp: FeedPost,
  feedVariant: FeedVariant,
}) => {
  return (
    <article className={ styles.post_wrapper }>
      <div className={ styles.profile_picture }></div>
      <div className={ styles.post_main }>
        <header className={ styles.profile_header }>
          <div className={ styles.profile_info }>
            <cite>
              <span className={ styles.profile_fullName }>
              { fp.full_name }
              </span>
              <span className={ styles.profile_username }>
              @{ fp.username }
              </span>
              <span className={ styles.post_time }>
                <span className={ styles.spacer } aria-hidden>·</span>
                { fp.date }
              </span>
            </cite>
          </div>
          <button aria-label='User actions' className={ styles.profile_userActions }>
            <MoreIcon />
          </button>
        </header>
        <p className={ styles.post_content }>
          { fp.post_body }
        </p>
        {
          fp.context_note
          && feedVariant.valueOf() !== FeedVariant.NoContext.valueOf()
          && <section className={ styles.context_note_wrapper } aria-label='Context note'>
            <div className={ styles.context_note_box }>
              <header>
                <UsersIcon />
                <h3>{ getContextTitleByFeedVariant(feedVariant) }</h3>
              </header>
              <p className={ styles.context_note_body }>
                { fp.context_note }
              </p>
            </div>
            <footer>
              <p>{ getContextSubtextByFeedVariant(feedVariant) }</p>
            </footer>
          </section>
        }
        <footer>
          <ul className={ styles.post_actions_list }>
            <li>
              <button aria-label='Reply' title='Reply'>
                <ReplyIcon />
                <span>{ fp.num_comments }</span>
              </button>
            </li>
            <li>
              <button aria-label='Repost' title='Repost'>
                <RepostIcon />
                <span>{ fp.num_reposts }</span>
              </button>
            </li>
            <li>
              <button aria-label='Like' title='Like'>
                <LikeIcon />
                <span>{ fp.num_likes }</span>
              </button>
            </li>
            <li>
              <button aria-label='View' title='View'>
                <ViewsIcon />
                <span>{ fp.views }</span>
              </button>
            </li>
            <li className={ styles.post_actions_notext_wrapper }>
              <button aria-label='Bookmark' title='Bookmark' className={ styles.post_actions_notext }>
                <BookmarkIcon />
              </button>
              <button aria-label='Share' title='Share' className={ styles.post_actions_notext }>
                <ShareIcon />
              </button>
            </li>
          </ul>
        </footer>
      </div>
    </article>
  );
}

export default MockPost;