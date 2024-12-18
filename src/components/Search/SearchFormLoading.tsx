import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'

export function SearchFormLoading() {
  const q = useSearchParamsQuery()

  if (!q) {
    return null
  }

  return <p className="text-xs font-mono">요청중...</p>
}
