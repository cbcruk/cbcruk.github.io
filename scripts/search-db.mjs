import Database from 'better-sqlite3'
import memoData from '../public/search-db.json' assert { type: 'json' }

const db = new Database('public/search.db', { verbose: console.log })

db.prepare(`DROP TABLE IF EXISTS memo`).run()
db.prepare(`DROP TABLE IF EXISTS memo_fts`).run()
db.prepare(
  `CREATE VIRTUAL TABLE memo USING FTS5(id, body, tags, ctime, mtime)`
).run()

const insertMemo = db.prepare(
  `INSERT INTO memo (id, body, tags, ctime, mtime) VALUES (@id, @body, @tags, @ctime, @mtime)`
)
const insertMany = db.transaction((memos) => {
  for (const memo of memos) {
    insertMemo.run(memo)
  }
})

insertMany(
  memoData.map((memo) => {
    return {
      id: memo.id,
      body: memo.body,
      tags: JSON.stringify(memo.data.tags),
      ctime: memo.data.ctime,
      mtime: memo.data.mtime,
    }
  })
)

db.close()
