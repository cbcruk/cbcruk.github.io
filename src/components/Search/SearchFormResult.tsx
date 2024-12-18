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
import { useSearchWorker } from './hooks/useSearchWorker'
import type { CollectionEntry } from 'astro:content'
import { Suspense } from 'react'
import { SearchFormLoading } from './SearchFormLoading'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryState } from 'nuqs'

type MemoEntry = CollectionEntry<'memo'>
type MemoData = MemoEntry['data']
type SearchResult = {
  id: MemoEntry['id']
  body: MemoEntry['body']
  tags: MemoData['tags'][number]
  ctime: MemoData['ctime']
  mtime: MemoData['mtime']
}

function SearchFormResult() {
  const [q] = useQueryState('q')
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
                {JSON.parse(memo.tags).map((tag: string) => (
                  <MemoTag key={tag} tag={tag} />
                ))}
              </MemoTags>
              <MemoIdAndDate>
                <MemoId id={memo.id} />
                <MemoDate ctime={memo.ctime} mtime={memo.mtime} />
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
