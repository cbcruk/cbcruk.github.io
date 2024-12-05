import { SearchFormWorker } from './SearchFormWorker'
import { SearchFromResultWithSuspense } from './SearchFormResult'

export function SearchForm() {
  return <SearchFormWorker>{SearchFromResultWithSuspense}</SearchFormWorker>
}
