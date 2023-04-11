// @ts-check
import clsx from 'clsx'
import { useState } from 'react'
import { day } from '../../lib/time'

export function MemoDate({ createdAt, lastModified, className }) {
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
