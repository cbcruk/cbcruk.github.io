import { getExcerpt } from '@components/Memo/Memo.utils'
import { SYNONYMS } from './synonyms'

export type CorpusEntry = {
  i: string
  t?: string
  k: string[]
  c: string
  m: string
  b: string
}

type Indexed = {
  entry: CorpusEntry
  /** 원문 소문자 사본 */
  haystack: string
  /** 공백을 지운 사본. `타입추론` 으로 `타입 추론` 을 찾기 위한 것 */
  squashed: string
}

export type SearchHit = {
  id: string
  title: string
  tags: string[]
  ctime: string
  mtime: string
  /** 실제로 걸린 말. 질의와 다를 수 있다 (`리액트` → `react`) */
  term: string
  head: string
  hit: string
  tail: string
}

/** 질의 끝에 붙는 조사·어미. 떼면 `타입을` 7건이 `타입` 29건이 된다 */
const JOSA =
  /(을|를|이|가|은|는|의|에서|에게|에|으로|로|와|과|도|만|보다|처럼|까지|부터|하는|하다|한다|했다|하기|되는|된다)$/

const SNIPPET_BEFORE = 40
const SNIPPET_AFTER = 80
const TITLE_LENGTH = 120

const LITERAL = 3
const SQUASHED = 2
const DERIVED = 1

export function prepare(corpus: CorpusEntry[]): Indexed[] {
  return corpus.map((entry) => {
    const raw = `${entry.t ?? ''}\n${entry.k.join(' ')}\n${entry.b}`

    return {
      entry,
      haystack: raw.toLowerCase(),
      squashed: raw.toLowerCase().replace(/\s+/g, ''),
    }
  })
}

function snippet(entry: CorpusEntry, term: string): SearchHit {
  const at = entry.b.toLowerCase().indexOf(term)
  const title = entry.t || getExcerpt(entry.b, TITLE_LENGTH)

  const base = {
    id: entry.i,
    title,
    tags: entry.k,
    ctime: entry.c,
    mtime: entry.m,
    term,
  }

  if (at === -1) {
    return { ...base, head: '', hit: '', tail: '' }
  }

  const from = Math.max(0, at - SNIPPET_BEFORE)
  const to = at + term.length + SNIPPET_AFTER

  return {
    ...base,
    head: `${from > 0 ? '…' : ''}${entry.b.slice(from, at)}`,
    hit: entry.b.slice(at, at + term.length),
    tail: `${entry.b.slice(at + term.length, to)}${to < entry.b.length ? '…' : ''}`,
  }
}

/**
 * 네 패스를 union 하고 순위만 나눈다. 앞 패스가 걸려도 멈추지 않는다 —
 * 멈추면 `타입을` 이 7건에서 끝나고 어간 `타입` 의 29건에 닿지 못한다.
 */
export function search(index: Indexed[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase()

  if (!q) {
    return []
  }

  const ranked = new Map<string, { weight: number; term: string }>()

  const add = (ids: Indexed[], weight: number, term: string) => {
    for (const { entry } of ids) {
      const found = ranked.get(entry.i)

      if (!found || found.weight < weight) {
        ranked.set(entry.i, { weight, term })
      }
    }
  }

  add(
    index.filter((d) => d.haystack.includes(q)),
    LITERAL,
    q
  )

  const squashed = q.replace(/\s+/g, '')

  if (squashed) {
    add(
      index.filter((d) => d.squashed.includes(squashed)),
      SQUASHED,
      squashed
    )
  }

  const stem = q.replace(JOSA, '')

  if (stem !== q && stem.length >= 2) {
    add(
      index.filter((d) => d.haystack.includes(stem)),
      DERIVED,
      stem
    )
  }

  const synonym = SYNONYMS[q] ?? SYNONYMS[stem]

  if (synonym) {
    add(
      index.filter((d) => d.haystack.includes(synonym)),
      DERIVED,
      synonym
    )
  }

  const byId = new Map(index.map((d) => [d.entry.i, d.entry]))

  return [...ranked.entries()]
    .sort(
      ([idA, a], [idB, b]) => b.weight - a.weight || Number(idB) - Number(idA)
    )
    .map(([id, { term }]) => snippet(byId.get(id)!, term))
}
