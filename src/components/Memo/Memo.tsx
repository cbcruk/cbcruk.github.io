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
import { match, P } from 'ts-pattern'

export function Memo({ type = 'memo', memo, children }: Props) {
  return (
    <MemoPrimitive>
      {match(memo.data.title)
        .with(P.string.minLength(1), (title) => (
          <h2 className="font-bold text-base mb-4">{title}</h2>
        ))
        .otherwise(() => null)}
      <MemoBody>{children}</MemoBody>
      <MemoFooter className="mt-4">
        <MemoTags>
          {memo.data.tags.map((tag) => (
            <MemoTag key={tag} tag={tag} />
          ))}
          {memo.data.embed && <MemoEmbedLink url={memo.data.embed} />}
        </MemoTags>
        <MemoIdAndDate>
          <MemoId id={memo.id} type={type} />
          <MemoDate ctime={memo.data.ctime} mtime={memo.data.mtime} />
        </MemoIdAndDate>
      </MemoFooter>
    </MemoPrimitive>
  )
}
