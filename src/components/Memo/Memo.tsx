import { MemoBody } from '@components/Memo/MemoBody'
import {
  Memo as MemoPrimitive,
  MemoTags,
  MemoFooter,
  MemoIdAndDate,
  MemoSummary,
  MemoWhen,
} from '@components/Memo/MemoPrimitive'
import { MemoDate } from '@components/Memo/MemoDate'
import { MemoTag } from '@components/Memo/MemoTag'
import { MemoId } from '@components/Memo/MemoId'
import { MemoEmbedLink } from '@components/Memo/MemoEmbedLink'
import { MemoRaw } from '@components/Memo/MemoRaw'
import { MemoSources } from '@components/Memo/MemoSources'
import { getUnlinkedSources } from '@components/Memo/Memo.utils'
import type { Props } from './Memo.types'

export function Memo({ raw = false, preview = false, memo, children }: Props) {
  // 출처는 메모 페이지에서만 낸다. 목록(preview)에서는 길이와 무관하게 뺀다
  const sources = preview ? [] : getUnlinkedSources(memo)

  return (
    <MemoPrimitive>
      <>
        <MemoBody>{children}</MemoBody>
        <MemoSources sources={sources} />
      </>
      <MemoFooter className="mt-4">
        <MemoTags>
          {memo.data.tags.map((tag) => (
            <MemoTag key={tag} tag={tag} />
          ))}
          {memo.data.embed && <MemoEmbedLink url={memo.data.embed} />}
        </MemoTags>
        <MemoIdAndDate>
          {raw ? <MemoRaw id={memo.id} /> : <MemoId id={memo.id} />}
          <MemoDate ctime={memo.data.ctime} mtime={memo.data.mtime} />
        </MemoIdAndDate>
      </MemoFooter>
    </MemoPrimitive>
  )
}
