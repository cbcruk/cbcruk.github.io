import { useEffect, useState } from 'react'
import corpusUrl from '@generated/search-corpus.json?url'
import { MemoLayout } from '@components/MemoLayout/MemoLayout'
import {
  Memo as MemoEntry,
  MemoFooter,
  MemoIdAndDate,
  MemoTags,
} from '@components/Memo/MemoPrimitive'
import { MemoTag } from '@components/Memo/MemoTag'
import { MemoId } from '@components/Memo/MemoId'
import { MemoDate } from '@components/Memo/MemoDate'
import { SearchFormLoading } from './SearchFormLoading'
import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'
import { prepare, search, type CorpusEntry, type SearchHit } from './search'

type Index = ReturnType<typeof prepare>

/**
 * 모듈 스코프에 둔다 — 검색어를 고칠 때마다 다시 받지 않기 위한 것이고,
 * 새로고침 뒤의 재사용은 HTTP 캐싱이 맡는다 (`_astro/*` 는 immutable).
 */
let loading: Promise<Index> | null = null

function loadIndex(): Promise<Index> {
  loading ??= fetch(corpusUrl)
    .then((response) => response.json() as Promise<CorpusEntry[]>)
    .then(prepare)

  return loading
}

function Hit({ hit }: { hit: SearchHit }) {
  return (
    <MemoEntry>
      <h2 className="font-bold text-base">{hit.title}</h2>
      {hit.hit && (
        <p className="mt-2 leading-relaxed text-(--flexoki-300) whitespace-pre-wrap">
          {hit.head}
          <mark className="rounded-sm px-0.5 bg-(--flexoki-green-400) text-(--flexoki-950)">
            {hit.hit}
          </mark>
          {hit.tail}
        </p>
      )}
      <MemoFooter className="mt-4">
        <MemoTags>
          {hit.tags.map((tag) => (
            <MemoTag key={tag} tag={tag} />
          ))}
        </MemoTags>
        <MemoIdAndDate>
          <MemoId id={hit.id} />
          <MemoDate ctime={hit.ctime} mtime={hit.mtime} />
        </MemoIdAndDate>
      </MemoFooter>
    </MemoEntry>
  )
}

export function SearchFormResult() {
  const q = useSearchParamsQuery()
  const [index, setIndex] = useState<Index | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!q || index) {
      return
    }

    let alive = true

    loadIndex()
      .then((loaded) => alive && setIndex(loaded))
      .catch((cause) => alive && setError(cause as Error))

    return () => {
      alive = false
    }
  }, [q, index])

  if (!q) {
    return null
  }

  if (error) {
    return <p className="p-2 text-xs font-mono rounded-md">{error.message}</p>
  }

  if (!index) {
    return <SearchFormLoading />
  }

  const hits = search(index, q)

  if (hits.length === 0) {
    return <p className="text-xs font-bold">🤔 검색결과값이 없습니다.</p>
  }

  return (
    <MemoLayout>
      {hits.map((hit) => (
        <Hit key={hit.id} hit={hit} />
      ))}
    </MemoLayout>
  )
}

export default SearchFormResult
