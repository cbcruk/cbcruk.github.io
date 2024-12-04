import { lazy, Suspense } from 'react'
import { match, P } from 'ts-pattern'
import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'
import { SearchFormLoading } from './SearchFormLoading'
import { SearchFormWorker } from './SearchFormWorker'

const SearchFormResult = lazy(() => import('./SearchFormResult'))

export function SearchForm() {
  const q = useSearchParamsQuery()

  return (
    <SearchFormWorker>
      {() => (
        <Suspense
          fallback={match({ q })
            .with({ q: P.string.minLength(1) }, () => <SearchFormLoading />)
            .otherwise(() => null)}
        >
          <SearchFormResult q={q} />
        </Suspense>
      )}
    </SearchFormWorker>
  )
}
