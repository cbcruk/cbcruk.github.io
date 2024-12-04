import { useSearchWorker } from './hooks/useSearchWorker'

export function SearchFormWorker({ children }) {
  const { data } = useSearchWorker()

  if (!data) {
    return null
  }

  return <>{children({ worker: data })}</>
}
