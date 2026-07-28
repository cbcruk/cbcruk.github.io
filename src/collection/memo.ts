import { getCollection, type CollectionEntry } from 'astro:content'

export const getReleaseMemoCollection = () =>
  getCollection('memo', ({ data }) => data.status === 'release')

export const getReleaseThinkCollection = () =>
  getCollection('think', ({ data }) => data.status === 'release')

export const getRandomMemoCollection = async () => {
  const memoCollection = await getReleaseMemoCollection()
  const memos = memoCollection.toSorted(() => Math.random() - 0.5).slice(0, 10)

  return memos
}

// 쿼리를 버리면 youtube.com/watch?v=... 가 전부 같은 URL로 뭉친다
const normalizeUrl = (url: string): string => {
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

const urlCache = new Map<string, Set<string>>()

const getUrls = (memo: CollectionEntry<'memo'>): Set<string> => {
  const cached = urlCache.get(memo.id)

  if (cached) {
    return cached
  }

  const urls = new Set(
    [...(memo.body ?? '').matchAll(/https?:\/\/[^\s)\]<>"']+/g)].map(([url]) =>
      normalizeUrl(url.replace(/[.,]+$/, ''))
    )
  )

  urlCache.set(memo.id, urls)

  return urls
}

const buildDocumentFrequency = (
  memos: CollectionEntry<'memo'>[]
): Map<string, number> => {
  const df = new Map<string, number>()

  for (const memo of memos) {
    for (const tag of memo.data.tags) {
      df.set(tag, (df.get(tag) ?? 0) + 1)
    }
  }

  return df
}

export const getRelatedMemos = async (
  current: CollectionEntry<'memo'>,
  limit = 5
): Promise<CollectionEntry<'memo'>[]> => {
  const memos = await getReleaseMemoCollection()
  const df = buildDocumentFrequency(memos)

  const currentTags = new Set(current.data.tags)
  const currentUrls = getUrls(current)

  if (currentTags.size === 0 && currentUrls.size === 0) {
    return []
  }

  const idf = (tag: string): number => 1 / Math.log(2 + (df.get(tag) ?? 1))

  return memos
    .filter((memo) => memo.id !== current.id)
    .map((memo) => {
      const tagScore = memo.data.tags
        .filter((tag) => currentTags.has(tag))
        .reduce((sum, tag) => sum + idf(tag), 0)

      // 같은 URL을 가리키는 건 공유 태그 하나보다 강한 증거다.
      // 태그만 보면 놓치는 관계가 있다 — 같은 글을 가리키는 메모쌍 29개 중
      // 14쌍은 공유 태그가 0개다 (→ 577.md)
      const sharedUrls = [...getUrls(memo)].filter((url) =>
        currentUrls.has(url)
      ).length

      return { memo, score: tagScore + sharedUrls }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ memo }) => memo)
}

type Relation = 'continues' | 'supersedes'

export type MemoChild = {
  memo: CollectionEntry<'memo'>
  relation: Relation
}

export type MemoLineage = {
  ancestors: CollectionEntry<'memo'>[]
  children: MemoChild[]
  supersededBy: CollectionEntry<'memo'>[]
}

export const getLineage = async (
  current: CollectionEntry<'memo'>
): Promise<MemoLineage> => {
  const memos = await getReleaseMemoCollection()
  const byId = new Map(memos.map((memo) => [memo.id, memo]))

  const childrenById = new Map<string, CollectionEntry<'memo'>[]>()

  for (const memo of memos) {
    const parent = memo.data.parent

    if (!parent) {
      continue
    }

    childrenById.set(parent, [...(childrenById.get(parent) ?? []), memo])
  }

  const ancestors: CollectionEntry<'memo'>[] = []
  const visited = new Set<string>([current.id])
  let cursor = current.data.parent

  while (cursor && byId.has(cursor) && !visited.has(cursor)) {
    visited.add(cursor)

    const ancestor = byId.get(cursor)!

    ancestors.unshift(ancestor)
    cursor = ancestor.data.parent
  }

  const children: MemoChild[] = (childrenById.get(current.id) ?? []).map(
    (memo) => ({ memo, relation: memo.data.relation })
  )

  return {
    ancestors,
    children,
    supersededBy: children
      .filter(({ relation }) => relation === 'supersedes')
      .map(({ memo }) => memo),
  }
}
