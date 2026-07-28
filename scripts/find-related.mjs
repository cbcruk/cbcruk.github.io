/**
 * parent 후보 찾기 — 공유 태그(IDF)와 공유 URL 두 신호를 함께 본다.
 *
 * 태그만 보면 놓치는 관계가 있다. 같은 글을 가리키는 메모쌍 29개 중
 * 14쌍은 공유 태그가 0개여서 태그 유사도로는 영원히 만나지 못한다.
 * 같은 URL을 가리킨다는 건 태그보다 직접적인 증거다. (→ 577.md)
 *
 *   node scripts/find-related.mjs 229          메모 ID (태그 + URL 둘 다)
 *   node scripts/find-related.mjs react,rsc    태그만
 *   node scripts/find-related.mjs 229 --all    비공개까지 (통합 후보)
 *
 * 기본은 `release` 후보만 — `parent`는 공개된 메모에서만 해석된다.
 * URL이 겹치는 29쌍 중 16쌍은 양쪽 다 비공개(주로 archive 링크 덤프)라
 * `--all` 로만 보인다. 그건 계보가 아니라 통합 후보다.
 */
import fs from 'node:fs/promises'
import fg from 'fast-glob'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  const fm = match ? match[1] : ''

  const tagsLine = fm.match(/^tags:\s*\[([\s\S]*?)\]/m)
  const tags = tagsLine
    ? tagsLine[1]
        .split(',')
        .map((value) => value.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    : []

  const status = (fm.match(/^status:\s*(\w+)/m) ?? [])[1] ?? 'draft'

  return { tags, status }
}

// 쿼리를 버리면 youtube.com/watch?v=... 가 전부 같은 URL로 뭉친다
function normalizeUrl(url) {
  try {
    const parsed = new URL(url)

    return (
      parsed.host.replace(/^www\./, '') +
      parsed.pathname.replace(/\/$/, '') +
      (parsed.search || '')
    )
  } catch {
    return url
  }
}

function extractUrls(raw) {
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
  const found = [...body.matchAll(/https?:\/\/[^\s)\]<>"']+/g)].map(([url]) =>
    normalizeUrl(url.replace(/[.,]+$/, ''))
  )

  return new Set(found)
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

  const includeUnpublished = process.argv.includes('--all')
  const entries = await fg.glob('./src/content/memo/*.{md,mdx}')
  const memos = await Promise.all(
    entries.map(async (path) => {
      const raw = await fs.readFile(path, 'utf-8')
      const id = path.match(/\/(\d+)\.(md|mdx)$/)[1]

      return { id, raw, urls: extractUrls(raw), ...parseFrontmatter(raw) }
    })
  )

  const candidates = includeUnpublished
    ? memos
    : memos.filter((memo) => memo.status === 'release')

  // IDF 는 공개된 코퍼스 기준으로 고정한다 (--all 여부로 점수가 흔들리지 않게)
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

  if (isId && !source) {
    console.error(`memo ${arg} not found`)
    process.exit(1)
  }

  const sourceTags = new Set(
    isId ? source.tags : arg.split(',').map((value) => value.trim())
  )
  // 태그로 호출하면 아직 파일이 없을 수 있으므로 URL 신호는 ID 호출에서만
  const sourceUrls = isId ? source.urls : new Set()

  if (sourceTags.size === 0 && sourceUrls.size === 0) {
    console.error('no usable tags or urls')
    process.exit(1)
  }

  const ranked = candidates
    .filter((memo) => memo.id !== arg)
    .map((memo) => {
      const sharedTags = memo.tags.filter((tag) => sourceTags.has(tag))
      const sharedUrls = [...memo.urls].filter((url) => sourceUrls.has(url))
      const tagScore = sharedTags.reduce((sum, tag) => sum + idf(tag), 0)

      // 같은 URL을 가리키는 건 공유 태그 하나보다 강한 증거다
      return { memo, sharedUrls, tagScore, score: tagScore + sharedUrls.length }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  if (ranked.length === 0) {
    console.log('후보 없음')
    return
  }

  for (const { memo, sharedUrls, tagScore } of ranked) {
    const signals = [`태그 ${tagScore.toFixed(2)}`]

    if (sharedUrls.length > 0) {
      signals.push(`공유 URL ${sharedUrls.length}`)
    }

    const status = memo.status === 'release' ? '' : ` (${memo.status})`

    console.log(
      `#${memo.id}${status}  ${signals.join(' / ')}  [${memo.tags.join(', ')}]  ${firstLine(memo.raw)}`
    )

    for (const url of sharedUrls.slice(0, 3)) {
      console.log(`      ↳ ${url}`)
    }
  }
}

main()
