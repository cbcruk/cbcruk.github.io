import fs from 'node:fs'
import path from 'node:path'

const DIR = process.env.MEMO_DIR ?? 'src/content/memo'
const strict = process.argv.includes('--strict')

const NON_CODE_FENCE = /^(md|markdown|text|plaintext)$/i

/**
 * 링크를 렌더하는 컴포넌트 (`<QuoteLink url="...">제목</QuoteLink>`).
 * JSX 로 걸러버리면 링크가 하나도 없는 것으로 보여서 bookmarks 가 note 로 샌다.
 */
const LINK_COMPONENT = /^<([A-Z]\w*)\s[^>]*\b(?:url|href)="(https?:\/\/[^"]+)"/

/**
 * 본문에서 선언과 대조할 신호를 뽑는다 — 코드 줄 수와 링크 수.
 * - 코드 펜스: ```md 처럼 산문을 인용한 펜스는 코드로 세지 않는다
 * - 링크: 불릿 링크 + 맨 URL 줄 + 링크 컴포넌트
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
  let linkComponent = null
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

    // 링크 컴포넌트는 여는 줄부터 닫는 줄까지를 링크 불릿 하나로 접는다.
    // 자식(링크 제목)은 산문이 아니라 링크의 일부다 — `- [제목](URL)` 과 같다.
    if (linkComponent) {
      if (line.includes(`</${linkComponent}>`)) {
        linkComponent = null
      }

      continue
    }

    const component = line.trim().match(LINK_COMPONENT)

    if (component) {
      const [, tag, url] = component

      kept.push(`- <${url}>`)

      if (!line.includes(`</${tag}>`) && !/\/>\s*$/.test(line)) {
        linkComponent = tag
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
    linkBullets: linkBullets.length,
    isEmpty: meaningful.length === 0 && codeLines === 0,
    footnoteDefs,
    footnoteRefs,
  }
}

const field = (frontmatter, key) =>
  (frontmatter.match(new RegExp(`^${key}: (.*)$`, 'm')) ?? [])[1]?.trim()

/**
 * docs/memo-spec.md 의 필드 표와 content.config.ts 의 스키마를 대조한다.
 *
 * 같은 규칙이 스키마·린터·문서·스킬 네 곳에 흩어져 있어서, 필드를 하나
 * 추가할 때마다 네 군데를 고쳐야 했다. 최소한 문서와 스키마가 어긋나는
 * 것은 기계가 잡는다 (실제로 `embed` 가 스키마에만 있고 문서에 없었다).
 */
const checkSpecDrift = () => {
  const specPath = 'docs/memo-spec.md'
  const configPath = 'src/content.config.ts'

  if (!fs.existsSync(specPath) || !fs.existsSync(configPath)) {
    return
  }

  const spec = fs.readFileSync(specPath, 'utf8')
  const table = spec.match(
    /<!-- fields:start -->([\s\S]*?)<!-- fields:end -->/
  )

  if (!table) {
    add('error', specPath, '필드 표 마커(fields:start/end)를 찾을 수 없다')
    return
  }

  const documented = new Map(
    [...table[1].matchAll(/^\|\s*`(\w+)`\s*\|\s*(필수|선택)\s*\|/gm)].map(
      ([, name, required]) => [name, required === '필수']
    )
  )

  const config = fs.readFileSync(configPath, 'utf8')
  const schema = config.match(
    /const memo = defineCollection\(\{[\s\S]*?schema: z\.object\(\{([\s\S]*?)\n {2}\}\)/
  )

  if (!schema) {
    add('error', configPath, 'memo 스키마를 파싱할 수 없다')
    return
  }

  const actual = new Map(
    [...schema[1].matchAll(/^ {4}(\w+):\s*(.+)$/gm)].map(([, name, value]) => [
      name,
      !/\.optional\(\)|\.default\(/.test(value),
    ])
  )

  for (const [name, required] of actual) {
    if (!documented.has(name)) {
      add('error', specPath, `스키마에 있는 \`${name}\` 이 필드 표에 없다`)
    } else if (documented.get(name) !== required) {
      add(
        'error',
        specPath,
        `\`${name}\` 의 필수 여부가 스키마와 다르다 ` +
          `(문서: ${documented.get(name) ? '필수' : '선택'}, 스키마: ${required ? '필수' : '선택'})`
      )
    }
  }

  for (const name of documented.keys()) {
    if (!actual.has(name)) {
      add('error', specPath, `필드 표의 \`${name}\` 이 스키마에 없다`)
    }
  }
}

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

  // 링크는 붙여넣은 순간이 최종형이라 "작성 중"이 없다.
  // draft 를 "공개 안 함"으로 쓰면 작성 중 큐가 방치된 링크로 막힌다.
  // 이 규칙 자체가 draft 에 대한 것이므로 level 로 낮추지 않는다.
  if (declared === 'bookmarks' && status === 'draft') {
    add(
      'error',
      target,
      'type: bookmarks 인데 status: draft — archive 아니면 release 다'
    )
  }

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

  // 논리적으로 모순인 조합 — 판단 여지가 없다.
  // 임계값이 없어서 처방도 하나다: 선언을 고치거나 본문을 고치거나.
  if (declared === 'snippet' && analyzed.codeLines === 0) {
    add(level, target, 'type: snippet 인데 코드 블록이 없다')
  }
  if (declared === 'bookmarks' && analyzed.codeLines > 0) {
    add(
      level,
      target,
      `type: bookmarks 인데 코드 블록이 있다 (${analyzed.codeLines}줄) — snippet 아닌지 확인`
    )
  }
  if (declared === 'bookmarks' && analyzed.linkBullets === 0) {
    add(level, target, 'type: bookmarks 인데 링크가 없다')
  }
}

checkSpecDrift()

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
