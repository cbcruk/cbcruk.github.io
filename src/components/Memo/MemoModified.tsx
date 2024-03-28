import { getLocaleDateString } from '@components/Memo/MemoModified.utils'
import type { Props } from './MemoModified.types'

export function MemoModified({ date }: Props) {
  return <>modified on {getLocaleDateString(date)}</>
}
