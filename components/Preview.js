// @ts-check
import { MemoBody } from './Preview/MemoBody'
import { MemoDate } from './Preview/MemoDate'
import { MemoEmbedUrls } from './Preview/MemoEmbedUrls'
import { MemoTags } from './Preview/MemoTags'

/**
 *
 * @param {object} props
 * @param {string} props.type
 * @param {import('$lib/types').MemoRecord[]} props.items
 */
function Preview({ items }) {
  return (
    <div className="items">
      {items.map(({ id, fields }) => {
        return (
          <div
            key={id}
            className="border border-sky-900 rounded-md overflow-hidden mt-4 first:mt-0"
          >
            {Object.keys(fields.serialize.frontmatter).length > 0 && (
              <div className="flex items-center justify-between p-4 py-2 text-sm bg-sky-900/40">
                {fields.serialize.frontmatter.title}
                <MemoEmbedUrls embed={fields.serialize.frontmatter.embed} />
              </div>
            )}
            <MemoBody serialize={fields.serialize} />
            <div className="flex justify-between items-center p-4 text-[10px] text-gray-300">
              <MemoTags tags={fields.tags} />
              <MemoDate
                createdAt={fields.createdAt}
                lastModified={fields.lastModified}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Preview
