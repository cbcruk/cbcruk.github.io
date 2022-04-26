// @ts-check
import Link from 'next/link'

export function MemoTags({ tags }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {tags.map((tag, index) => {
        return (
          <Link key={index} href={`/tagged/${tag}`}>
            <a className="border border-sky-800 rounded-full px-2 py-1 bg-sky-900/30 whitespace-nowrap">
              #{tag}
            </a>
          </Link>
        )
      })}
    </div>
  )
}
