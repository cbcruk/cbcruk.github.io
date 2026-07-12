/**
 * 코멘트 테이블 초기화.
 *
 *   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... node scripts/init-comments.mjs
 *
 * 환경변수가 없으면 로컬 file:comments.db 에 생성합니다 (개발용).
 */
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:comments.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

await client.batch(
  [
    `CREATE TABLE IF NOT EXISTS comment (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      memo_id  TEXT NOT NULL,
      author   TEXT NOT NULL,
      body     TEXT NOT NULL,
      status   TEXT NOT NULL DEFAULT 'approved'
               CHECK(status IN ('approved', 'hidden', 'spam')),
      ip_hash  TEXT,
      ctime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE INDEX IF NOT EXISTS idx_comment_memo
       ON comment(memo_id, status, ctime)`,
    `CREATE INDEX IF NOT EXISTS idx_comment_ip_time
       ON comment(ip_hash, ctime)`,
  ],
  'write'
)

console.log('✅ comment 테이블 준비 완료')
