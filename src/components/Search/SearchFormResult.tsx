import { MemoLayout } from '@components/MemoLayout/MemoLayout'
import { MemoBody } from '@components/Memo/MemoBody'
import {
  Memo as MemoEntry,
  MemoFooter,
  MemoIdAndDate,
  MemoTags,
} from '@components/Memo/MemoPrimitive'
import { MemoTag } from '@components/Memo/MemoTag'
import { MemoId } from '@components/Memo/MemoId'
import { MemoDate } from '@components/Memo/MemoDate'
import useSWR from 'swr'
import type { CollectionEntry } from 'astro:content'
import { Suspense } from 'react'
import { SearchFormLoading } from './SearchFormLoading'
import { ErrorBoundary } from 'react-error-boundary'
import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'
import type { getReleaseMemoCollection } from '@collection/memo'

type MemoEntry = CollectionEntry<'memo'>

type SearchResult = Awaited<ReturnType<typeof getReleaseMemoCollection>>

function SearchFormResult() {
  const q = useSearchParamsQuery()

  const { data } = useSWR(
    q || null,
    () =>
      fetch(
        `${
          import.meta.env.PROD ? 'https://cbcruk-github-io.vercel.app' : ''
        }/api/search?q=${q}`
      ).then((r) => r.json()) as Promise<SearchResult>,
    {
      suspense: true,
      revalidateOnFocus: false,
    }
  )

  if (!data) {
    return null
  }

  if (q && data.length === 0) {
    return <p className="text-xs font-bold">🤔 검색결과값이 없습니다.</p>
  }

  return (
    <MemoLayout>
      {data.map((memo) => {
        return (
          <MemoEntry key={memo.id}>
            <MemoBody>
              <pre
                className="p-2 overflow-auto rounded-md text-[10px] line-clamp-6 bg-slate-800"
                dangerouslySetInnerHTML={{
                  __html: (memo.body || '')
                    .trim()
                    .replaceAll(q, `<mark>${q}</mark>`),
                }}
              />
            </MemoBody>
            <MemoFooter className="mt-4">
              <MemoTags>
                {memo.data.tags.map((tag) => (
                  <MemoTag key={tag} tag={tag} />
                ))}
              </MemoTags>
              <MemoIdAndDate>
                <MemoId type="memo" id={memo.id} />
                <MemoDate ctime={memo.data.ctime} mtime={memo.data.mtime} />
              </MemoIdAndDate>
            </MemoFooter>
          </MemoEntry>
        )
      })}
    </MemoLayout>
  )
}

export function SearchFromResultWithSuspense() {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <p className="p-2 text-xs font-mono rounded-md">{error?.message}</p>
      )}
    >
      <Suspense fallback={<SearchFormLoading />}>
        <SearchFormResult />
      </Suspense>
    </ErrorBoundary>
  )
}

export default SearchFormResult
