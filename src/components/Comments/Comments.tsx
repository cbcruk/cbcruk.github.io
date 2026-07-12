import useSWR from 'swr'
import { fetchComments, type Comment } from './Comments.types'
import { CommentList } from './CommentList'
import { CommentForm } from './CommentForm'
import { CommentSection, CommentSectionTitle } from './CommentPrimitive'

type Props = {
  memoId: string
}

export function Comments({ memoId }: Props) {
  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    ['comments', memoId],
    () => fetchComments(memoId),
    { revalidateOnFocus: false }
  )

  const comments = data ?? []

  function handleCreated(comment: Comment) {
    // 낙관적 반영 후 서버와 동기화
    mutate([...comments, comment], { revalidate: true })
  }

  return (
    <CommentSection aria-label="코멘트">
      <CommentSectionTitle>코멘트 {comments.length}</CommentSectionTitle>

      {isLoading && (
        <p className="text-xs text-(--flexoki-400)">불러오는 중…</p>
      )}

      {error && (
        <p className="text-xs text-(--flexoki-red-400)">
          코멘트를 불러오지 못했습니다.
        </p>
      )}

      {!isLoading && !error && <CommentList comments={comments} />}

      <CommentForm memoId={memoId} onCreated={handleCreated} />
    </CommentSection>
  )
}
