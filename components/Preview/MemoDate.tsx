import clsx from 'clsx'
import { useState } from 'react'
import { day } from '../../lib/time'
import { MemoRecord } from '@/lib/types'

type Props = JSX.IntrinsicElements['span'] &
  Pick<MemoRecord['fields'], 'createdAt' | 'lastModified'>

export function MemoDate({ createdAt, lastModified, className }: Props) {
  const [state, setState] = useState(1)

  return (
    <span
      className={clsx([
        className,
        'px-2 text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer hidden',
      ])}
      onClick={() => setState((prev) => (prev === 0 ? 1 : 0))}
    >
      {(() => {
        switch (state) {
          case 0:
            return `생성됨: ${day(createdAt).format('YYYY-MM-DD HH:mm:ss')}`
          case 1:
            return `편집됨: ${day(lastModified).format('YYYY-MM-DD HH:mm:ss')}`
          default:
            return null
        }
      })()}
    </span>
  )
}
