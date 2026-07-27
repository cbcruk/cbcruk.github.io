/**
 * 압축 대상 찾기 — 문체로 "남의 문장"을 검출한다.
 *
 * 번역문·AI 요약·문서 발췌는 존댓말("~합니다")로 들어오고, 내 메모는
 * 평서체("~다")로 쓴다. 그래서 인용 표시 없이 존댓말이 지배하는 부분은
 * 아직 내 언어로 줄이지 않은 남의 문장이다. (→ 577.md)
 *
 * 빌드에 연결하지 않는다 — 문체는 논리적 모순이 아니라 판단이라서
 * 경고가 상주하면 린터를 무시하게 된다. 필요할 때 돌리는 도구.
 *
 * ⚠ 이 검출기는 "남의 문장"을 판정하지 못한다. **확인 대상만 제시**하고
 * 판단은 사람이 한다. 저자가 존댓말로 쓴 자기 글과 번역문을 구분할 수
 * 없기 때문이다 — 309.md는 본인의 작업 기록인데 존댓말이라 검출되고
 * (그대로 두기로 했다), 268.md는 번역문이라 정리했다. 둘이 같은 신호다.
 *
 *   pnpm lint:voice            전체
 *   pnpm lint:voice --release  공개 중인 것만
 *   pnpm lint:voice --strict   검출되면 exit 1
 */
import fs from 'node:fs'
import path from 'node:path'

const DIR = process.env.MEMO_DIR ?? 'src/content/memo'
const releaseOnly = process.argv.includes('--release')
const strict = process.argv.includes('--strict')

// "니까?"는 저자 본인의 질문 문장에도 나온다 (218.mdx) — 넣으면 오검출.
// "니다"로 일반화하면 평서체인 "아니다"가 걸린다 — 어미를 명시한다.
const FORMAL =
  /(습니다|입니다|됩니다|합니다|줍니다|봅니다|옵니다|갑니다|십니다|세요)/g
const CASUAL =
  /(했다|한다|이다|였다|보인다|같다|된다|아니다|하자|말자|였음|없다|있다\.)/g

const count = (text, re) => (text.match(re) ?? []).length

const analyze = (raw) => {
  const parsed = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  if (!parsed) {
    return null
  }

  const [, frontmatter, body] = parsed

  let inFence = false
  const prose = []
  const footnotes = []

  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    // 코드는 대상이 아니다
    if (inFence) continue
    // 인용 표시가 된 외부 텍스트는 정직하다 — 대상이 아니다
    if (/^\s*>/.test(line)) continue

    // 각주도 압축 대상이다 (83.md 는 산문이 아니라 각주가 부풀려져 있었다)
    if (/^\[\^[^\]]+\]:/.test(line)) footnotes.push(line)
    else prose.push(line)
  }

  const field = (key) =>
    (frontmatter.match(new RegExp(`^${key}: (.*)$`, 'm')) ?? [])[1]?.trim()

  return {
    type: field('type'),
    status: field('status'),
    prose: prose.join('\n'),
    footnotes: footnotes.join('\n'),
  }
}

const findings = []

const files = fs
  .readdirSync(DIR)
  .filter((file) => /\.mdx?$/.test(file))
  .toSorted((a, b) => parseInt(a, 10) - parseInt(b, 10))

for (const file of files) {
  const analyzed = analyze(fs.readFileSync(path.join(DIR, file), 'utf8'))

  if (!analyzed) continue
  if (releaseOnly && analyzed.status !== 'release') continue

  const formal = count(analyzed.prose, FORMAL)
  const casual = count(analyzed.prose, CASUAL)
  const formalFootnotes = count(analyzed.footnotes, FORMAL)

  const where = []

  // 존댓말이 지배적일 때만 (평서체가 섞여 있으면 저자가 손댄 것)
  if (formal >= 3 && formal > casual * 2) {
    where.push(`산문 ${formal}곳 (평서체 ${casual}곳)`)
  }
  if (formalFootnotes >= 3) {
    where.push(`각주 ${formalFootnotes}곳`)
  }
  // 산문과 각주에 조금씩 나뉘어 있으면 각각은 문턱을 넘지 못한다 (23.md)
  if (
    where.length === 0 &&
    formal + formalFootnotes >= 3 &&
    formal + formalFootnotes > casual * 2
  ) {
    where.push(`산문 ${formal}곳 + 각주 ${formalFootnotes}곳`)
  }

  if (where.length > 0) {
    findings.push({
      file: path.join(DIR, file),
      type: analyzed.type,
      status: analyzed.status,
      where,
    })
  }
}

for (const { file, type, status, where } of findings) {
  console.log(`! ${file}  [${type} / ${status}]`)
  console.log(`  ${where.join(', ')}`)
}

console.log(
  `\n메모 ${files.length}개 중 ${findings.length}개에 남의 문장이 남아 있다` +
    `${releaseOnly ? ' (공개 중인 것만)' : ''}`
)

if (strict && findings.length > 0) {
  process.exit(1)
}
