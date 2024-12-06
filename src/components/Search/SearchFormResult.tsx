import { MemoLayout } from '@components/MemoLayout/MemoLayout'
import { MemoBody } from '@components/Memo/MemoBody'
import {
  Memo,
  MemoFooter,
  MemoIdAndDate,
  MemoTags,
} from '@components/Memo/MemoPrimitive'
import { MemoTag } from '@components/Memo/MemoTag'
import { MemoId } from '@components/Memo/MemoId'
import { MemoDate } from '@components/Memo/MemoDate'
import useSWR from 'swr'
import { useSearchWorker } from './hooks/useSearchWorker'
import type { CollectionEntry } from 'astro:content'
import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'
import { Suspense } from 'react'
import { SearchFormLoading } from './SearchFormLoading'
import { ErrorBoundary } from 'react-error-boundary'

type Memo = CollectionEntry<'memo'>
type MemoData = Memo['data']
type SearchResult = {
  slug: Memo['slug']
  body: Memo['body']
  tags: MemoData['tags'][number]
  ctime: MemoData['ctime']
  mtime: MemoData['mtime']
}

function SearchFormResult() {
  const q = useSearchParamsQuery()
  const { data: worker } = useSearchWorker()
  const { data } = useSWR(
    q || null,
    () => {
      try {
        return worker?.db.query(
          `SELECT * FROM memo WHERE body MATCH '"${q}"' ORDER BY mtime DESC`
        ) as Promise<SearchResult[]>
      } catch (error) {
        throw error
      }
    },
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
          <Memo key={memo.slug}>
            <MemoBody>
              <pre
                className="p-2 overflow-auto rounded-md text-[10px] line-clamp-6 bg-slate-800"
                dangerouslySetInnerHTML={{
                  __html: memo.body.trim().replaceAll(q, `<mark>${q}</mark>`),
                }}
              />
            </MemoBody>
            <MemoFooter className="mt-4">
              <MemoTags>
                {JSON.parse(memo.tags).map((tag) => (
                  <MemoTag key={tag} tag={tag} />
                ))}
              </MemoTags>
              <MemoIdAndDate>
                <MemoId id={memo.slug} />
                <MemoDate ctime={memo.ctime} mtime={memo.mtime} />
              </MemoIdAndDate>
            </MemoFooter>
          </Memo>
        )
      })}
    </MemoLayout>
  )
}

export function SearchFromResultWithSuspense() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
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
