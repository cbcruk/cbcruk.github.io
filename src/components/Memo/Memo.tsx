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
import { getSummary, getWhen, isLongMemo } from '@components/Memo/Memo.utils'
import type { Props } from './Memo.types'
import { match, P } from 'ts-pattern'

export function Memo({ raw = false, preview = false, memo, children }: Props) {
  // 긴 메모는 목록에서 전문 대신 요약 한 줄만 낸다. 짧은 메모는 접을 이유가 없다
  const folded = preview && isLongMemo(memo)
  const summary = folded ? getSummary(memo) : ''
  const when = folded ? getWhen(memo) : ''

  return (
    <MemoPrimitive>
      {match(memo.data.title)
        .with(P.string.minLength(1), (title) => (
          <h2 className="font-bold text-base mb-4">{title}</h2>
        ))
        .otherwise(() => null)}
      {folded ? (
        <>
          {summary && <MemoSummary>{summary}</MemoSummary>}
          {when && (
            <MemoWhen>
              <b className="font-bold">언제</b> — {when}
            </MemoWhen>
          )}
        </>
      ) : (
        <MemoBody>{children}</MemoBody>
      )}
      <MemoFooter className="mt-4">
        <MemoTags>
          {memo.data.tags.map((tag) => (
            <MemoTag key={tag} tag={tag} />
          ))}
          {memo.data.embed && <MemoEmbedLink url={memo.data.embed} />}
        </MemoTags>
        <MemoIdAndDate>
          <MemoId id={memo.id} />
          {raw && <MemoRaw id={memo.id} />}
          <MemoDate ctime={memo.data.ctime} mtime={memo.data.mtime} />
        </MemoIdAndDate>
      </MemoFooter>
    </MemoPrimitive>
  )
}
