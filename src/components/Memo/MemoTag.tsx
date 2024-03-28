import { MemoTag as MemoTagPrimitive } from '@components/Memo/MemoPrimitive'

export function MemoTag({ tag }) {
  return <MemoTagPrimitive href={`/tagged/${tag}`}>#{tag}</MemoTagPrimitive>
}
