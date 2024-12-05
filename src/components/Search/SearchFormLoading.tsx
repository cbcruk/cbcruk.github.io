import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'

export function SearchFormLoading() {
  const q = useSearchParamsQuery()

  if (!q) {
    return null
  }

  return <p className="text-sm font-mono">검색중...</p>
}
