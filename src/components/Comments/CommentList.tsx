import { format } from '@formkit/tempo'
import type { Comment } from './Comments.types'
import {
  CommentItem,
  CommentMeta,
  CommentAuthor,
  CommentBody,
} from './CommentPrimitive'

/** SQLite CURRENT_TIMESTAMP('YYYY-MM-DD HH:MM:SS', UTC)을 로컬 시각으로 파싱 */
function parseUtc(ctime: string): Date {
  return new Date(`${ctime.replace(' ', 'T')}Z`)
}

type Props = {
  comments: Comment[]
}

export function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <p className="text-xs text-(--flexoki-400)">
        아직 코멘트가 없습니다. 첫 코멘트를 남겨보세요.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {comments.map((comment) => (
        <li key={comment.id}>
          <CommentItem>
            <CommentMeta>
              <CommentAuthor>{comment.author}</CommentAuthor>
              <time dateTime={comment.ctime}>
                {format(parseUtc(comment.ctime), 'YYYY-MM-DD HH:mm', 'ko')}
              </time>
            </CommentMeta>
            <CommentBody>{comment.body}</CommentBody>
          </CommentItem>
        </li>
      ))}
    </ul>
  )
}
