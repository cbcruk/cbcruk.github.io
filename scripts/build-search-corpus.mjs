import fs from 'node:fs'
import path from 'node:path'

const DIR = process.env.MEMO_DIR ?? 'src/content/memo'
const OUT = 'src/generated/search-corpus.json'

const field = (frontmatter, key) =>
  (frontmatter.match(new RegExp(`^${key}: (.*)$`, 'm')) ?? [])[1]?.trim()

const tags = (frontmatter) =>
  [...(field(frontmatter, 'tags') ?? '').matchAll(/['"]([^'"]+)['"]/g)].map(
    (matched) => matched[1]
  )

/**
 * 제목 폴백(`getExcerpt`)은 여기서 계산하지 않는다. 본문을 어차피 보내므로
 * 클라이언트가 `Memo.utils` 의 함수를 그대로 쓰면 되고, 그러면 발췌 규칙이
 * 목록·계보·검색에서 갈라지지 않는다.
 */
const corpus = fs
  .readdirSync(DIR)
  .filter((file) => /\.mdx?$/.test(file))
  .flatMap((file) => {
    const raw = fs.readFileSync(path.join(DIR, file), 'utf8')
    const parsed = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

    if (!parsed) {
      return []
    }

    const [, frontmatter, body] = parsed

    if (field(frontmatter, 'status') !== 'release') {
      return []
    }

    const title = field(frontmatter, 'title')

    return [
      {
        i: file.replace(/\.mdx?$/, ''),
        ...(title ? { t: title } : {}),
        k: tags(frontmatter),
        c: field(frontmatter, 'ctime'),
        m: field(frontmatter, 'mtime'),
        b: body.trim(),
      },
    ]
  })
  .sort((a, b) => Number(b.i) - Number(a.i))

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(corpus))

console.log(
  `검색 코퍼스 ${corpus.length}개 → ${OUT} (${fs
    .statSync(OUT)
    .size.toLocaleString()} 바이트)`
)
