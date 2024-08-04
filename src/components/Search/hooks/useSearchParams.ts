import { useSyncExternalStore } from 'react'
import history from 'history/browser'

export function useSearchParams() {
  const location = useSyncExternalStore(history.listen, () => history.location)
  const searchParams = new URLSearchParams(location.search)

  return searchParams
}
