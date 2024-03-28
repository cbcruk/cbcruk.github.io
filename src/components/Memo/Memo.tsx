import { MemoBody } from '@components/Memo/MemoBody'
import {
  Memo as MemoPrimitive,
  MemoTags,
  MemoFooter,
  MemoIdAndDate,
} from '@components/Memo/MemoPrimitive'
import { MemoDate } from '@components/Memo/MemoDate'
import { MemoTag } from '@components/Memo/MemoTag'
import { MemoId } from '@components/Memo/MemoId'
import { MemoEmbedLink } from '@components/Memo/MemoEmbedLink'
import type { Props } from './Memo.types'

export function Memo({ memo, children }: Props) {
  return (
    <MemoPrimitive>
      <MemoBody>{children}</MemoBody>
      <MemoFooter className="mt-4">
        <MemoTags>
          {memo.data.tags.map((tag) => (
            <MemoTag key={tag} tag={tag} />
          ))}
          {memo.data.embed && <MemoEmbedLink url={memo.data.embed} />}
        </MemoTags>
        <MemoIdAndDate>
          <MemoId id={memo.slug} />
          <MemoDate ctime={memo.data.ctime} mtime={memo.data.mtime} />
        </MemoIdAndDate>
      </MemoFooter>
    </MemoPrimitive>
  )
}
