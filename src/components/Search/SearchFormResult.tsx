import { Suspense, use, useDeferredValue } from 'react'
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
import { SearchErrorBoundary } from './SearchErrorBoundary'
import { prepare, search, type CorpusEntry, type SearchHit } from './search'

type Index = ReturnType<typeof prepare>

/**
 * 모듈 스코프에 둔다 — 검색어를 고칠 때마다 다시 받지 않기 위한 것이고,
 * 새로고침 뒤의 재사용은 HTTP 캐싱이 맡는다 (`_astro/*` 는 immutable).
 *
 * 받기 시작하는 건 여기가 아니다. `search.astro` 의 `<link rel="preload">` 가
 * HTML 파싱 중에 이미 시작한다 — 이 `fetch` 는 그 응답을 받는다.
 *
 * 모듈 최상단 `const` 로 펴지 않는다. 그러면 임포트하는 순간 `fetch` 가 나가서
 * 브라우저가 아닌 곳(테스트·SSR)에서는 상대 경로를 못 읽고 터진다.
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

function Hits({ q }: { q: string }) {
  // 모듈 스코프에 memo 된 같은 promise 라 렌더마다 다시 받지 않는다
  const hits = search(use(loadIndex()), q)

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

export function SearchFormResult({ q }: { q: string }) {
  // 흔한 글자는 300건이 걸린다. 그 목록을 한 번에 그리면 141ms 짜리 긴 작업이
  // 되어 그 동안 친 글자가 화면에 안 들어온다 — 늦은 쪽으로 그려 중단 가능하게 한다
  const deferredQuery = useDeferredValue(q)

  // `q` 가 아니라 늦은 쪽으로 가른다. 빠른 쪽으로 가르면 늦은 쪽이 아직 빈
  // 문자열인 렌더가 한 번 커밋되면서 빈 상태 문구가 한 프레임 스친다
  if (!deferredQuery) {
    return null
  }

  return (
    <SearchErrorBoundary>
      <Suspense fallback={<SearchFormLoading />}>
        <Hits q={deferredQuery} />
      </Suspense>
    </SearchErrorBoundary>
  )
}

export default SearchFormResult
