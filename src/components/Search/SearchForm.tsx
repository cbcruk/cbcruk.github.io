import { lazy, Suspense } from 'react'
import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'
import { SearchFormLoading } from './SearchFormLoading'
import { match, P } from 'ts-pattern'

const SearchFormResult = lazy(() => import('./SearchFormResult'))

export function SearchForm() {
  const q = useSearchParamsQuery()

  return (
    <Suspense
      fallback={match({ q })
        .with({ q: P.string.minLength(1) }, () => <SearchFormLoading />)
        .otherwise(() => null)}
    >
      <SearchFormResult q={q} />
    </Suspense>
  )
}
