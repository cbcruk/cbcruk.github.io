/**
 * 코멘트 모더레이션 (직접 DB 접근 방식 — 관리 UI 없음).
 *
 *   node scripts/moderate-comments.mjs list [memoId]
 *   node scripts/moderate-comments.mjs hide <id>
 *   node scripts/moderate-comments.mjs spam <id>
 *   node scripts/moderate-comments.mjs approve <id>
 *   node scripts/moderate-comments.mjs delete <id>
 *
 * 환경변수: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN (미설정 시 file:comments.db)
 */
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:comments.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const [command, arg] = process.argv.slice(2)

async function setStatus(id, status) {
  await client.execute({
    sql: `UPDATE comment SET status = ? WHERE id = ?`,
    args: [status, Number(id)],
  })
  console.log(`✅ #${id} → ${status}`)
}

switch (command) {
  case 'list': {
    const rs = arg
      ? await client.execute({
          sql: `SELECT id, memo_id, author, status, ctime, body
                FROM comment WHERE memo_id = ? ORDER BY ctime DESC`,
          args: [arg],
        })
      : await client.execute(
          `SELECT id, memo_id, author, status, ctime, body
           FROM comment ORDER BY ctime DESC LIMIT 50`
        )

    for (const r of rs.rows) {
      const preview = String(r.body).replace(/\s+/g, ' ').slice(0, 60)
      console.log(
        `#${r.id} [${r.status}] memo:${r.memo_id} ${r.author} (${r.ctime}) — ${preview}`
      )
    }
    break
  }
  case 'hide':
    await setStatus(arg, 'hidden')
    break
  case 'spam':
    await setStatus(arg, 'spam')
    break
  case 'approve':
    await setStatus(arg, 'approved')
    break
  case 'delete':
    await client.execute({
      sql: `DELETE FROM comment WHERE id = ?`,
      args: [Number(arg)],
    })
    console.log(`🗑️  #${arg} 삭제됨`)
    break
  default:
    console.log(
      'usage: moderate-comments.mjs <list|hide|spam|approve|delete> [arg]'
    )
}
