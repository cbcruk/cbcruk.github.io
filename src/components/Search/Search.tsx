import { SearchFormField } from './SearchFormField'
import { SearchFormResult } from './SearchFormResult'
import { useSearchParamsQuery } from './hooks/useSearchParamsQuery'

export function Search() {
  const query = useSearchParamsQuery()

  return (
    <div className="flex flex-col gap-4">
      <label className="relative flex h-9 w-full p-2 px-3 rounded-xl bg-(--flexoki-950) text-(--flexoki-green-400) text-xs">
        <span className="relative text-sm z-[1]" aria-label="검색">
          🔦
        </span>
        <SearchFormField query={query} />
      </label>
      <div className="mt-0">
        <SearchFormResult q={query} />
      </div>
    </div>
  )
}
