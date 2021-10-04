import clsx from 'clsx'
import Link from 'next/link'
import { fromNow } from '../lib/time'

function Preview({ type, items }) {
  return (
    <div className="items mt-4">
      {items.map(({ number, title, bodyText, createdAt, updatedAt }, index) => {
        return (
          <div
            key={number}
            className={clsx('mt-4 font-sans', {
              'pt-2 border-t border-gray-300 dark:border-gray-500': index !== 0,
            })}
          >
            <h2 className="text-lg font-bold">
              <Link href={`/${type}/${number}`}>
                <a>{title}</a>
              </Link>
            </h2>
            <p className="mt-1 text-sm">{bodyText.slice(0, 100)}...</p>
            <div
              className="mt-2 text-xs text-gray-600 dark:text-gray-300"
              title={`${fromNow(updatedAt)} 수정`}
            >
              opened {fromNow(createdAt)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Preview
