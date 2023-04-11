import clsx from 'clsx'
import { MemoBody } from './MemoBody'
import { MemoDate } from './MemoDate'
import { MemoEmbedUrl } from './MemoEmbedUrl'
import { MemoFooter } from './MemoFooter'
import { MemoTags } from './MemoTags'

export function MemoItem({
  id,
  serialize,
  tags,
  createdAt,
  lastModified,
  className = '',
}) {
  return (
    <div
      className={clsx(
        'MemoItem relative border-2 border-[color:var(--solarized-background-highlight)] rounded-xl overflow-hidden mt-4 first:mt-0',
        className
      )}
      onClick={async (e) => {
        if (!id) {
          return
        }

        const url = `${location.origin}/memo/item/${id}`

        if (e.altKey) {
          await navigator.clipboard.writeText(url)
          return
        }
      }}
    >
      <style jsx>{`
        .MemoItem :global(.MemoItem-date) {
          opacity: 0;
          transition: 0.3s all ease-out;
        }
      `}</style>
      <MemoBody serialize={serialize} />
      <div className="flex justify-between items-center p-4 text-[10px]">
        <MemoTags tags={tags} />
        {serialize.frontmatter.embed && (
          <MemoEmbedUrl url={serialize.frontmatter.embed} />
        )}
      </div>
      <MemoDate
        className="MemoItem-date"
        createdAt={createdAt}
        lastModified={lastModified}
      />
      <MemoFooter id={id} lastModified={lastModified} />
    </div>
  )
}
