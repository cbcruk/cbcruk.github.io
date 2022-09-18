// @ts-check
import { MemoBody } from './Preview/MemoBody'
import { MemoDate } from './Preview/MemoDate'
import { MemoEmbedUrl } from './Preview/MemoEmbedUrl'
import { MemoTags } from './Preview/MemoTags'

/**
 *
 * @param {object} props
 * @param {string} props.type
 * @param {import('$lib/types').MemoRecord[]} props.items
 */
function Preview({ items }) {
  return (
    <div className="Preview items">
      <style jsx>{`
        .Preview-item :global(.MemoItem-date) {
          opacity: 0;
          transition: 0.3s all ease-out;
        }
      `}</style>
      {items.map(({ id, fields }) => {
        return (
          <div
            key={id}
            className="Preview-item border-2 border-[color:var(--solarized-background-highlight)] rounded-xl overflow-hidden mt-4 first:mt-0"
          >
            <MemoBody serialize={fields.serialize} />
            <div className="flex justify-between items-center p-4 text-[10px]">
              <MemoTags tags={fields.tags} />
              {fields.serialize.frontmatter.embed && (
                <MemoEmbedUrl url={fields.serialize.frontmatter.embed} />
              )}
            </div>
            <MemoDate
              className="MemoItem-date"
              createdAt={fields.createdAt}
              lastModified={fields.lastModified}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Preview
