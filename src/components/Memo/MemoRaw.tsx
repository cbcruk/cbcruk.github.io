import { MemoId as MemoIdPrimitive } from '@components/Memo/MemoPrimitive'
import type { Category } from './Memo.types'

type Props = {
  type: Category
  id: string
}

export function MemoRaw({ type, id }: Props) {
  return <MemoIdPrimitive href={`/${type}/${id}.md`}>raw</MemoIdPrimitive>
}
