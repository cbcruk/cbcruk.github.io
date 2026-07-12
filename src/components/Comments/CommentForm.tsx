import { useState } from 'react'
import { LIMITS, postComment, type Comment } from './Comments.types'
import {
  CommentFormRoot,
  CommentInput,
  CommentTextarea,
  CommentSubmit,
  CommentHint,
  CommentError,
} from './CommentPrimitive'

type Props = {
  memoId: string
  onCreated: (comment: Comment) => void
}

export function CommentForm({ memoId, onCreated }: Props) {
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('') // 허니팟
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit =
    author.trim().length >= LIMITS.author.min &&
    body.trim().length >= LIMITS.body.min &&
    !pending

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setPending(true)
    setError(null)

    try {
      const comment = await postComment({ memoId, author, body, website })

      onCreated(comment)
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '작성에 실패했습니다.')
    } finally {
      setPending(false)
    }
  }

  return (
    <CommentFormRoot onSubmit={handleSubmit}>
      <CommentInput
        aria-label="이름"
        placeholder="이름"
        value={author}
        maxLength={LIMITS.author.max}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <CommentTextarea
        aria-label="코멘트"
        placeholder="코멘트를 남겨주세요"
        value={body}
        maxLength={LIMITS.body.max}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      {error && <CommentError>{error}</CommentError>}
      <div className="flex items-center justify-between">
        <CommentHint>
          {body.trim().length}/{LIMITS.body.max}
        </CommentHint>
        <CommentSubmit type="submit" disabled={!canSubmit}>
          {pending ? '작성 중…' : '작성'}
        </CommentSubmit>
      </div>
    </CommentFormRoot>
  )
}
