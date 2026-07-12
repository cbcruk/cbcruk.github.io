export interface Comment {
  id: number
  memo_id: string
  author: string
  body: string
  ctime: string
}

export const LIMITS = {
  author: { min: 1, max: 40 },
  body: { min: 1, max: 2000 },
} as const

const API_BASE = import.meta.env.PROD ? 'https://cbcruk-github-io.vercel.app' : ''

export function commentsUrl(memoId: string): string {
  return `${API_BASE}/api/comments?memoId=${encodeURIComponent(memoId)}`
}

export async function fetchComments(memoId: string): Promise<Comment[]> {
  const res = await fetch(commentsUrl(memoId))

  if (!res.ok) {
    throw new Error('코멘트를 불러오지 못했습니다.')
  }

  return res.json()
}

export interface PostCommentInput {
  memoId: string
  author: string
  body: string
  /** 허니팟 — 항상 빈 문자열로 전송 */
  website: string
}

export async function postComment(input: PostCommentInput): Promise<void> {
  const res = await fetch(`${API_BASE}/api/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))

    throw new Error(data?.error ?? '코멘트 작성에 실패했습니다.')
  }
}
