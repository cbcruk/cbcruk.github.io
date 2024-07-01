import { useDeferredValue, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'

export function Tags({ tags }) {
  const [fuse] = useState(() => new Fuse(tags, { minMatchCharLength: 2 }))
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const refIndexes = fuse.search(deferredQuery).map((item) => item.refIndex)

  return (
    <main>
      <label className="relative flex items-center gap-2">
        <span className="absolute left-2 text-sm">🔦</span>
        <input
          type="search"
          className="p-2 pl-7 px-3 rounded-xl bg-[--solarized-background-highlight] text-[--solarized-green] text-xs"
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />
      </label>
      <div className="flex flex-wrap gap-1 mt-4 text-xs">
        {tags.map((tag, index) => (
          <a
            data-is-includes={refIndexes.includes(index)}
            key={tag}
            href={`/tagged/${tag}`}
            className="p-1 rounded-lg hover:bg-[--solarized-background-highlight] hover:text-[--solarized-violet] data-[is-includes='true']:bg-[--solarized-background-highlight] data-[is-includes='true']:text-[--solarized-violet]"
          >
            #{tag}
          </a>
        ))}
      </div>
    </main>
  )
}
