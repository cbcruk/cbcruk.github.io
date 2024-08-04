import { useSearchParams } from './useSearchParams'

export function useSearchParamsQuery() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''

  return q
}
