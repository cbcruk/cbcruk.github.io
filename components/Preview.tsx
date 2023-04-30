import { MemoRecord } from '@/lib/types'
import { MemoItem } from './Preview/MemoItem'
import { match } from 'ts-pattern'

type Props = {
  items: MemoRecord[]
}

function Preview({ items }: Props) {
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
