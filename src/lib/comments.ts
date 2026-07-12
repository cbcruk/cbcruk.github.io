import { createClient, type Client } from '@libsql/client'
import { createHash } from 'node:crypto'

/**
 * 코멘트 저장소 (Turso / libSQL).
 *
 * 환경변수:
 * - TURSO_DATABASE_URL  예) libsql://xxx.turso.io  (미설정 시 로컬 file:comments.db)
 * - TURSO_AUTH_TOKEN    Turso 인증 토큰
 * - COMMENT_IP_SALT     IP 해시용 솔트 (미설정 시 기본값)
 */

const DATABASE_URL = process.env.TURSO_DATABASE_URL ?? 'file:comments.db'
const AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN
const IP_SALT = process.env.COMMENT_IP_SALT ?? 'cbcruk-comment-salt'

export const LIMITS = {
  author: { min: 1, max: 40 },
  body: { min: 1, max: 2000 },
  /** 같은 IP에서 rate.seconds 안에 rate.count개 초과 작성 금지 */
  rate: { count: 3, seconds: 60 },
} as const

export type CommentStatus = 'approved' | 'hidden' | 'spam'

export interface Comment {
  id: number
  memo_id: string
  author: string
  body: string
  ctime: string
}

let client: Client | null = null

function getClient(): Client {
  if (!client) {
    client = createClient({ url: DATABASE_URL, authToken: AUTH_TOKEN })
  }

  return client
}

export function hashIp(ip: string): string {
  return createHash('sha256').update(`${IP_SALT}:${ip}`).digest('hex')
}

export async function getComments(memoId: string): Promise<Comment[]> {
  const rs = await getClient().execute({
    sql: `SELECT id, memo_id, author, body, ctime
          FROM comment
          WHERE memo_id = ? AND status = 'approved'
          ORDER BY ctime ASC`,
    args: [memoId],
  })

  return rs.rows as unknown as Comment[]
}

async function countRecentByIp(ipHash: string): Promise<number> {
  const rs = await getClient().execute({
    sql: `SELECT COUNT(*) AS n
          FROM comment
          WHERE ip_hash = ? AND ctime > datetime('now', ?)`,
    args: [ipHash, `-${LIMITS.rate.seconds} seconds`],
  })

  return Number(rs.rows[0].n)
}

export interface CreateCommentInput {
  memoId: string
  author: string
  body: string
  ip: string
}

export type CreateResult =
  | { ok: true; comment: Comment }
  | { ok: false; status: number; error: string }

export async function createComment(
  input: CreateCommentInput
): Promise<CreateResult> {
  const memoId = input.memoId.trim()
  const author = input.author.trim()
  const body = input.body.trim()

  if (!memoId) {
    return { ok: false, status: 400, error: '대상 메모가 없습니다.' }
  }

  if (author.length < LIMITS.author.min || author.length > LIMITS.author.max) {
    return {
      ok: false,
      status: 400,
      error: `이름은 ${LIMITS.author.min}~${LIMITS.author.max}자여야 합니다.`,
    }
  }

  if (body.length < LIMITS.body.min || body.length > LIMITS.body.max) {
    return {
      ok: false,
      status: 400,
      error: `내용은 ${LIMITS.body.min}~${LIMITS.body.max}자여야 합니다.`,
    }
  }

  const ipHash = hashIp(input.ip)

  if ((await countRecentByIp(ipHash)) >= LIMITS.rate.count) {
    return {
      ok: false,
      status: 429,
      error: '잠시 후 다시 시도해주세요.',
    }
  }

  const rs = await getClient().execute({
    sql: `INSERT INTO comment (memo_id, author, body, ip_hash)
          VALUES (?, ?, ?, ?)
          RETURNING id, memo_id, author, body, ctime`,
    args: [memoId, author, body, ipHash],
  })

  return { ok: true, comment: rs.rows[0] as unknown as Comment }
}
