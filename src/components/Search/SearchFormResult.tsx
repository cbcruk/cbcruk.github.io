import { MemoLayout } from '@components/MemoLayout/MemoLayout'
import { MemoBody } from '@components/Memo/MemoBody'
import {
  Memo,
  MemoFooter,
  MemoIdAndDate,
  MemoTags,
} from '@components/Memo/MemoPrimitive'
import { MemoTag } from '@components/Memo/MemoTag'
import { MemoId } from '@components/Memo/MemoId'
import { MemoDate } from '@components/Memo/MemoDate'
import { useFuse } from './hooks/useFuse'

function SearchFormResult({ q }) {
  const fuse = useFuse()
  const result = fuse.search(q)

  return (
    <MemoLayout>
      {result.map((memo) => {
        return (
          <Memo key={memo.refIndex} data-score={memo.score}>
            <MemoBody>
              <pre
                className="p-2 overflow-auto rounded-md text-[10px] line-clamp-6 bg-slate-800"
                dangerouslySetInnerHTML={{
                  __html: memo.item.body
                    .trim()
                    .replaceAll(q, `<mark>${q}</mark>`),
                }}
              />
            </MemoBody>
            <MemoFooter className="mt-4">
              <MemoTags>
                {memo.item.data.tags.map((tag) => (
                  <MemoTag key={tag} tag={tag} />
                ))}
              </MemoTags>
              <MemoIdAndDate>
                <MemoId id={memo.item.slug} />
                <MemoDate
                  ctime={memo.item.data.ctime}
                  mtime={memo.item.data.mtime}
                />
              </MemoIdAndDate>
            </MemoFooter>
          </Memo>
        )
      })}
    </MemoLayout>
  )
}

export default SearchFormResult
