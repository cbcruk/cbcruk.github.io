import type { CollectionEntry } from 'astro:content'

const MAX_LENGTH = 64

const clean = (line: string): string =>
  line
    .replace(/^#+\s*/, '')
    .replace(/^>\s*/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 각주 참조는 발췌에서 의미가 없다 ([^235-1] 같은 마커가 그대로 남았다)
    .replace(/\[\^[^\]]+\]/g, '')
    .replace(/[`*_~]/g, '')
    .trim()

const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}…` : text

export const getExcerpt = (
  body: string | undefined,
  maxLength: number = MAX_LENGTH
): string => {
  if (!body) {
    return ''
  }

  let insideFence = false
  let insideJsx = false
  let prose = ''
  let fallback = ''

  for (const raw of body.split('\n')) {
    const line = raw.trim()

    if (line.startsWith('```')) {
      insideFence = !insideFence
      continue
    }

    // 여러 줄로 열린 JSX 의 속성 줄은 산문이 아니다 (354 의 `cite={{` 가 발췌로 나왔다)
    if (!insideFence && insideJsx) {
      insideJsx = !line.endsWith('>')
      continue
    }

    if (!insideFence && line.startsWith('<') && !line.endsWith('>')) {
      insideJsx = true
      continue
    }

    if (
      line.length === 0 ||
      line.startsWith('---') ||
      line.startsWith('|') ||
      line.startsWith('import ') ||
      line.startsWith('export ') ||
      /^\[\^/.test(line)
    ) {
      continue
    }

    if (!fallback) {
      fallback = clean(line)
    }

    if (!insideFence && !line.startsWith('<')) {
      prose = clean(line)

      if (prose.length > 0) {
        break
      }
    }
  }

  return truncate(prose || fallback, maxLength)
}

// 목록에서 본문을 접는 기준. release 308개의 p75 가 1,081자라 이 선을 넘는 건 47개(15%)다
const PREVIEW_THRESHOLD = 1500
const SUMMARY_LENGTH = 120
const WHEN_LENGTH = 200

// `**언제** — …` / `**언제**: …` 두 형태로 쓰고 있다. 항상 한 줄이다
const WHEN_PATTERN = /^\*\*언제\*\*\s*(?:—|-|:)?\s*(.+)$/m

export const isLongMemo = (memo: CollectionEntry<'memo'>): boolean =>
  (memo.body?.length ?? 0) > PREVIEW_THRESHOLD

// description 은 저자가 쓴 한 줄이고, 없으면 본문 첫 산문 줄로 대신한다
export const getSummary = (memo: CollectionEntry<'memo'>): string => {
  if (memo.data.description) {
    return memo.data.description
  }

  const excerpt = getExcerpt(memo.body, SUMMARY_LENGTH)

  // 첫 산문 줄이 곧 `언제` 줄이면 카드에 같은 문장이 두 번 나온다
  return excerpt.startsWith('언제') ? '' : excerpt
}

// 쿡북의 `언제` 는 저자가 색인으로 쓴 줄이다 (CLAUDE.md — "이게 색인이다")
export const getWhen = (memo: CollectionEntry<'memo'>): string => {
  const line = memo.body?.match(WHEN_PATTERN)?.[1]

  return line ? truncate(clean(line), WHEN_LENGTH) : ''
}

// 본문이 이미 링크한 출처를 아래에 또 내면 같은 목록이 두 번 나온다 — 80개 중 65개가
// bookmarks 처럼 본문 자체가 그 링크 목록이다. 남는 건 본문이 한 번도 안 가리킨 출처다
export const getUnlinkedSources = (
  memo: CollectionEntry<'memo'>
): NonNullable<CollectionEntry<'memo'>['data']['sources']> =>
  (memo.data.sources ?? []).filter(
    (source) => !source.resource || !memo.body?.includes(source.resource)
  )
