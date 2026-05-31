import type { CollectionEntry } from 'astro:content'
import type { MemoChild } from '@collection/memo'
import { getExcerpt } from './RelatedMemos.utils'

type Props = {
  ancestors: CollectionEntry<'memo'>[]
  descendants: MemoChild[]
  supersededBy: CollectionEntry<'memo'>[]
}

const label = (memo: CollectionEntry<'memo'>): string =>
  memo.data.title || getExcerpt(memo.body)

function MemoLink({
  memo,
  prefix,
  note,
}: {
  memo: CollectionEntry<'memo'>
  prefix: string
  note?: string
}) {
  return (
    <a
      href={`/memo/${memo.id}`}
      className="flex gap-2 text-[--flexoki-purple-500] hover:text-[--flexoki-purple-400]"
    >
      <span className="text-[--flexoki-400] whitespace-nowrap">
        {prefix} #{memo.id.slice(0, 10)}
      </span>
      <span className="text-ellipsis overflow-hidden whitespace-nowrap">
        {label(memo)}
      </span>
      {note && <span className="text-[--flexoki-400] whitespace-nowrap">{note}</span>}
    </a>
  )
}

export function MemoLineage({ ancestors, descendants, supersededBy }: Props) {
  if (ancestors.length === 0 && descendants.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="메모 계보"
      className="mt-4 border-2 border-[--flexoki-950] p-[10px] rounded-lg text-sm"
    >
      {supersededBy.length > 0 && (
        <p className="mb-2 text-[--flexoki-yellow-600]">
          ⚠ 더 최신 메모로 대체됨 →{' '}
          {supersededBy.map((memo) => (
            <a key={memo.id} href={`/memo/${memo.id}`} className="underline">
              #{memo.id.slice(0, 10)}
            </a>
          ))}
        </p>
      )}

      <h2 className="text-[10px] text-[--flexoki-400] mb-2">계보</h2>
      <ul className="flex flex-col gap-1">
        {ancestors.map((memo) => (
          <li key={memo.id}>
            <MemoLink memo={memo} prefix="↑" />
          </li>
        ))}
        {descendants.map(({ memo, relation }) => (
          <li key={memo.id}>
            <MemoLink
              memo={memo}
              prefix="↓"
              note={relation === 'supersedes' ? '(대체)' : undefined}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
