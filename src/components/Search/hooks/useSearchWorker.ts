import { getWorker } from 'src/lib/sql'
import useSWR from 'swr'

export function useSearchWorker() {
  const result = useSWR('sql.js-httpvfs', () => getWorker(), {
    suspense: false,
    revalidateOnFocus: false,
  })

  return result
}
