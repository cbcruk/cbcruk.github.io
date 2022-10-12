// @ts-check
import { MemoItem } from './Preview/MemoItem'

/**
 *
 * @param {object} props
 * @param {string} props.type
 * @param {import('$lib/types').MemoRecord[]} props.items
 */
function Preview({ items }) {
  return (
    <div className="Preview items">
      {items.map(({ id, fields }) => {
        return (
          <MemoItem
            key={id}
            id={id}
            serialize={fields.serialize}
            tags={fields.tags}
            createdAt={fields.createdAt}
            lastModified={fields.lastModified}
          />
        )
      })}
    </div>
  )
}

export default Preview
