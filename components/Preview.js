// @ts-check
import Link from 'next/link'
import { day, fromNow } from '../lib/time'

/**
 *
 * @param {object} props
 * @param {string} props.type
 * @param {import('@octokit/graphql-schema').Issue[]} props.items
 */
function Preview({ type, items }) {
  return (
    <div className="items">
      {items.map(
        ({ number, title, bodyText, comments, createdAt, updatedAt }) => {
          return (
            <div
              key={number}
              className="p-2 hover:bg-gray-700 rounded-md hover:shadow-md mt-2 first:mt-0 font-sans transition-all"
            >
              <Link href={`/${type}/${number}`}>
                <a>
                  <div className="block md:flex items-center gap-2">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                      {title}
                    </h2>
                    <p className="mt-1 text-xs text-gray-400">
                      {bodyText}
                      {comments && (
                        <span className="inline-block w-5 aspect-square p-1 rounded-lg bg-gray-600 ml-1 text-xs text-center leading-3">
                          {comments.totalCount}
                        </span>
                      )}
                    </p>
                  </div>
                  <div
                    className="mt-2 text-xs text-gray-300"
                    title={`opened ${fromNow(createdAt)}`}
                  >
                    {day(updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </a>
              </Link>
            </div>
          )
        }
      )}
    </div>
  )
}

export default Preview
