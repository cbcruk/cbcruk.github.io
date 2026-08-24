import { MemoId as MemoIdPrimitive } from '@components/Memo/MemoPrimitive'

type Props = {
  id: string
}

export function MemoRaw({ id }: Props) {
  return <MemoIdPrimitive href={`/memo/${id}.md`}>raw</MemoIdPrimitive>
}
