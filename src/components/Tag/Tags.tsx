import type { Props } from './Tags.types'
import clsx from 'clsx'
import type { CSSProperties } from 'react'
import { getRandomColor } from './Tags.utils'

export function Tags({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {tags.map((tag) => (
        <a
          key={tag}
          href={`/tagged/${tag}`}
          style={
            {
              '--highlight': getRandomColor(),
            } as CSSProperties
          }
          className={clsx([
            'p-1 rounded-lg bg-[--solarized-background-highlight] hover:bg-[--highlight] hover:text-[--solarized-background-highlight] transition',
            ``,
          ])}
        >
          #{tag}
        </a>
      ))}
    </div>
  )
}
