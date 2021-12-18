import clsx from 'clsx'
import Link from 'next/link'
import { fromNow } from '../lib/time'

function Preview({ type, items }) {
  return (
    <div className="items mt-4">
      {items.map(({ number, title, bodyText, createdAt, updatedAt }) => {
        return (
          <div
            key={number}
            className={clsx(
              'p-2 hover:bg-gray-700 rounded-md hover:shadow-md mt-2 font-sans transition-all'
            )}
          >
            <Link href={`/${type}/${number}`}>
              <a>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-1 text-sm">{bodyText}</p>
                <div
                  className="mt-2 text-xs text-gray-600 dark:text-gray-300"
                  title={`opened ${fromNow(createdAt)}`}
                >
                  updated {fromNow(updatedAt)}
                </div>
              </a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Preview
