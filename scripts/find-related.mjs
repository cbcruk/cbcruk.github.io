import fs from 'node:fs/promises'
import fg from 'fast-glob'

const STRUCTURAL_TAGS = new Set(['bookmarks'])

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  const fm = match ? match[1] : ''

  const tagsLine = fm.match(/^tags:\s*\[(.*)\]/m)
  const tags = tagsLine
    ? tagsLine[1]
        .split(',')
        .map((value) => value.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    : []

  const status = (fm.match(/^status:\s*(\w+)/m) ?? [])[1] ?? 'draft'

  return { tags, status }
}

function firstLine(raw) {
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
  let insideFence = false

  for (const line of body.split('\n').map((value) => value.trim())) {
    if (line.startsWith('```')) {
      insideFence = !insideFence
      continue
    }
    if (insideFence || line.length === 0 || line.startsWith('|')) {
      continue
    }
    return line.replace(/[`*_~#>]/g, '').slice(0, 64)
  }

  return ''
}

async function main() {
  const arg = process.argv[2]

  if (!arg) {
    console.error(
      'usage: node scripts/find-related.mjs <memoId | tag1,tag2,...>'
    )
    process.exit(1)
  }

  const entries = await fg.glob('./src/content/memo/*.{md,mdx}')
  const memos = await Promise.all(
    entries.map(async (path) => {
      const raw = await fs.readFile(path, 'utf-8')
      const id = path.match(/\/(\d+)\.(md|mdx)$/)[1]

      return { id, raw, ...parseFrontmatter(raw) }
    })
  )

  const release = memos.filter((memo) => memo.status === 'release')

  const df = new Map()
  for (const memo of release) {
    for (const tag of memo.tags) {
      df.set(tag, (df.get(tag) ?? 0) + 1)
    }
  }
  const idf = (tag) => 1 / Math.log(2 + (df.get(tag) ?? 1))

  const isId = /^\d+$/.test(arg)
  const source = isId ? memos.find((memo) => memo.id === arg) : null
  const sourceTags = new Set(
    (isId ? (source?.tags ?? []) : arg.split(',').map((value) => value.trim()))
      .filter((tag) => !STRUCTURAL_TAGS.has(tag))
  )

  if (sourceTags.size === 0) {
    console.error('no usable tags')
    process.exit(1)
  }

  const ranked = release
    .filter((memo) => memo.id !== arg)
    .map((memo) => ({
      memo,
      score: memo.tags
        .filter((tag) => sourceTags.has(tag))
        .reduce((sum, tag) => sum + idf(tag), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  for (const { memo, score } of ranked) {
    console.log(
      `#${memo.id}  ${score.toFixed(2)}  [${memo.tags.join(', ')}]  ${firstLine(memo.raw)}`
    )
  }
}

main()
