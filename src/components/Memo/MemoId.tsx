import { MemoId as MemoIdPrimitive } from '@components/Memo/MemoPrimitive'

type Props = {
  id: string
}

export function MemoId({ id }: Props) {
  return (
    <MemoIdPrimitive href={`/memo/${id}`}>#{id.slice(0, 10)}</MemoIdPrimitive>
  )
}
