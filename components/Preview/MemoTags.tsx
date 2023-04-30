import { MemoRecord } from '@/lib/types'
import Link from 'next/link'

type Props = Pick<MemoRecord['fields'], 'tags'>

export function MemoTags({ tags }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {tags.map((tag, index) => {
        return (
          <Link
            key={index}
            href={`/memo/search?tags=${tag}`}
            className="MemoTag px-2 py-1 rounded-lg bg-[color:var(--solarized-background-highlight)] whitespace-nowrap font-bold text-[11px] text-[color:var(--solarized-violet)]"
          >
            #{tag}
          </Link>
        )
      })}
    </div>
  )
}
