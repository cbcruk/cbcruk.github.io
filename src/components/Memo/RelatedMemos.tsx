import type { CollectionEntry } from 'astro:content'
import { getExcerpt } from './RelatedMemos.utils'

type Props = {
  memos: CollectionEntry<'memo'>[]
}

export function RelatedMemos({ memos }: Props) {
  if (memos.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="관련 메모"
      className="mt-4 border-2 border-[--flexoki-950] p-[10px] rounded-lg text-sm"
    >
      <h2 className="text-[10px] text-[--flexoki-400] mb-2">관련 메모</h2>
      <ul className="flex flex-col gap-1">
        {memos.map((memo) => {
          const excerpt = memo.data.title || getExcerpt(memo.body)

          return (
            <li key={memo.id}>
              <a
                href={`/memo/${memo.id}`}
                className="flex gap-2 text-[--flexoki-purple-500] hover:text-[--flexoki-purple-400]"
              >
                <span className="text-[--flexoki-400] whitespace-nowrap">
                  #{memo.id.slice(0, 10)}
                </span>
                <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {excerpt}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
