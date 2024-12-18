import { NuqsAdapter } from 'nuqs/adapters/react'
import { SearchFormField } from './SearchFormField'
import { SearchForm } from './SearchForm'

export function SearchFormNuqsAdapter() {
  return <NuqsAdapter>
    <div className="flex flex-col gap-4">
      <label
        className="relative flex h-9 w-full p-2 px-3 rounded-xl bg-[--solarized-background-highlight] text-[--solarized-green] text-xs"
      >
        <span className="relative text-sm z-[1]" aria-label="검색">🔦</span>
        <SearchFormField />
      </label>
      <div className="mt-0">
        <SearchForm />
      </div>
    </div>
  </NuqsAdapter>
}