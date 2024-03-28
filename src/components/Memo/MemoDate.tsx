import type { Props } from './MemoDate.types'
import { formatDate } from './MemoDate.utils'
import { MemoDate as MemoDatePrimitive } from './MemoPrimitive'

export function MemoDate({ ctime, mtime }: Props) {
  return (
    <MemoDatePrimitive title={`편집됨: ${formatDate(mtime)}`}>
      생성됨: {formatDate(ctime)}
    </MemoDatePrimitive>
  )
}
