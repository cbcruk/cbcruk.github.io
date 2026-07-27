import fs from 'node:fs'
import path from 'node:path'

const DIR = process.env.MEMO_DIR ?? 'src/content/memo'
const strict = process.argv.includes('--strict')

const NON_CODE_FENCE = /^(md|markdown|text|plaintext)$/i

/**
 * 본문에서 형태 신호를 추출한다.
 * - 코드 펜스: ```md 처럼 산문을 인용한 펜스는 코드로 세지 않는다
 * - 링크: 불릿 링크 + 맨 URL 줄
 * - 산문: 불릿/헤딩/각주정의/JSX/import 를 제외한 줄
 */
const analyze = (raw) => {
  const parsed = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  if (!parsed) {
    return null
  }

  const [, frontmatter, body] = parsed

  let inFence = false
  let fenceIsCode = true
  let codeLines = 0
  const kept = []

  for (const line of body.split('\n')) {
    const fence = line.match(/^\s*```([a-zA-Z]*)/)

    if (fence) {
      if (inFence) {
        inFence = false
      } else {
        inFence = true
        fenceIsCode = !NON_CODE_FENCE.test(fence[1])
      }

      continue
    }

    if (inFence) {
      if (line.trim() && fenceIsCode) {
        codeLines++
      }

      continue
    }

    kept.push(line)
  }

  const isBareUrl = (line) => /^\s*<?https?:\/\/\S+>?\s*$/.test(line)

  const meaningful = kept.filter((line) => {
    const text = line.trim()

    if (!text || text === '---') return false
    if (/^import\s/.test(text)) return false // mdx import
    if (/^<\/?[A-Z]/.test(text) || /^\/>$/.test(text) || /^>$/.test(text)) {
      return false // JSX
    }
    if (/^\[\^[^\]]+\]:/.test(text)) return false // 각주 정의

    return true
  })

  const bullets = meaningful.filter(
    (line) => /^\s*[-*]\s/.test(line) || isBareUrl(line)
  )
  const linkBullets = bullets.filter(
    (line) =>
      /\[[^\]]*\]\((https?:|\/)/.test(line) ||
      /^\s*[-*]\s+<?https?:\/\//.test(line) ||
      isBareUrl(line)
  )
  const prose = meaningful.filter(
    (line) =>
      !/^\s*[-*]\s/.test(line) &&
      !/^#{1,4}\s/.test(line) &&
      !/^\s*\d+\.\s/.test(line) &&
      !isBareUrl(line)
  )

  // 각주 참조/정의 — 인라인 코드를 지운다 (정규식 문자클래스 `[^"\\]` 가 각주로 잡힌다)
  const text = kept.join('\n').replace(/`[^`\n]*`/g, '')
  const footnoteDefs = new Set(
    [...text.matchAll(/^\[\^([^\]]+)\]:/gm)].map(([, id]) => id)
  )
  const footnoteRefs = new Set(
    [...text.matchAll(/\[\^([^\]]+)\](?!:)/g)].map(([, id]) => id)
  )

  return {
    frontmatter,
    codeLines,
    bullets: bullets.length,
    linkBullets: linkBullets.length,
    proseChars: prose.join(' ').length,
    isEmpty: meaningful.length === 0 && codeLines === 0,
    footnoteDefs,
    footnoteRefs,
  }
}

/**
 * type 은 형태(shape)만 담는다. 주제는 tags 가 담당한다.
 * - snippet:   코드가 주인공
 * - bookmarks: 링크 목록이 주인공, 코드 없음
 * - note:      나머지 (산문 중심)
 */
const classify = (a) => {
  if (a.codeLines >= 5) return 'snippet'
  if (a.codeLines >= 1 && a.proseChars <= 200) return 'snippet'

  if (a.codeLines === 0 && a.linkBullets >= 1) {
    const ratio = a.linkBullets / a.bullets

    if (a.proseChars === 0 && ratio === 1) return 'bookmarks'
    if (a.linkBullets >= 2 && a.proseChars <= 220 && ratio >= 0.6) {
      return 'bookmarks'
    }
    if (a.linkBullets >= 5 && ratio >= 0.85) return 'bookmarks'
  }

  return 'note'
}

const field = (frontmatter, key) =>
  (frontmatter.match(new RegExp(`^${key}: (.*)$`, 'm')) ?? [])[1]?.trim()

const findings = []
const add = (level, file, message) => findings.push({ level, file, message })

const files = fs
  .readdirSync(DIR)
  .filter((file) => /\.mdx?$/.test(file))
  .toSorted((a, b) => parseInt(a, 10) - parseInt(b, 10))

for (const file of files) {
  const target = path.join(DIR, file)
  const analyzed = analyze(fs.readFileSync(target, 'utf8'))

  if (!analyzed) {
    add('error', target, '프론트매터를 읽을 수 없음')
    continue
  }

  const declared = field(analyzed.frontmatter, 'type')
  const status = field(analyzed.frontmatter, 'status')

  // 작성 중(draft)은 아직 형태가 안 잡혔을 수 있으므로 경고로만 본다
  const level = status === 'draft' ? 'warn' : 'error'

  // 각주 짝 — 참조만 있으면 마커가 깨진 채 렌더되고, 정의만 있으면 렌더되지 않는다
  for (const id of analyzed.footnoteRefs) {
    if (!analyzed.footnoteDefs.has(id)) {
      add(level, target, `각주 [^${id}] 를 참조하는데 정의가 없다`)
    }
  }
  for (const id of analyzed.footnoteDefs) {
    if (!analyzed.footnoteRefs.has(id)) {
      add(level, target, `각주 [^${id}] 정의가 본문에서 참조되지 않는다`)
    }
  }

  // 본문이 비어 있으면 형태를 판정할 수 없다 (갓 만든 메모)
  if (analyzed.isEmpty) {
    continue
  }

  // 논리적으로 모순인 조합 — 판단 여지가 없다
  const contradictions = []

  if (declared === 'snippet' && analyzed.codeLines === 0) {
    contradictions.push('type: snippet 인데 코드 블록이 없다')
  }
  if (declared === 'bookmarks' && analyzed.codeLines > 0) {
    contradictions.push(
      `type: bookmarks 인데 코드 블록이 있다 (${analyzed.codeLines}줄) — snippet 아닌지 확인`
    )
  }
  if (declared === 'bookmarks' && analyzed.linkBullets === 0) {
    contradictions.push('type: bookmarks 인데 링크가 없다')
  }

  for (const message of contradictions) {
    add(level, target, message)
  }

  if (contradictions.length > 0) {
    continue
  }

  // 휴리스틱 불일치는 판단 여지가 있으므로 항상 경고
  const inferred = classify(analyzed)

  if (declared !== inferred) {
    add(
      'warn',
      target,
      `type: ${declared} 로 선언됐지만 본문은 ${inferred} 로 보인다 ` +
        `(링크 ${analyzed.linkBullets}/${analyzed.bullets}, 코드 ${analyzed.codeLines}줄, 산문 ${analyzed.proseChars}자)`
    )
  }
}

const errors = findings.filter(({ level }) => level === 'error')
const warnings = findings.filter(({ level }) => level === 'warn')

for (const { level, file, message } of findings) {
  console.log(`${level === 'error' ? '✗' : '!'} ${file}\n  ${message}`)
}

console.log(
  `\n메모 ${files.length}개 검사 — 오류 ${errors.length}, 경고 ${warnings.length}`
)

if (errors.length > 0 || (strict && warnings.length > 0)) {
  process.exit(1)
}
