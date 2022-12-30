import { getAllTags } from '$lib/airtable'
import Link from 'next/link'
import Fuse from 'fuse.js'
import Layout from '../../components/Layout'
import { useRef, useState } from 'react'
import clsx from 'clsx'

/**
 * @param {object} props
 * @param {import('$lib/types').TagRecord[]} props.data
 */
function Tagged({ data }) {
  const fuse = useRef(
    new Fuse(data, {
      keys: ['fields.select'],
      minMatchCharLength: 3,
    })
  ).current
  const [refIndexes, setRefIndexes] = useState([])

  return (
    <Layout title="메모 탐색하기" isShowTitle={false}>
      <label className="flex flex-col gap-1">
        <span>🔦</span>
        <input
          type="search"
          className="p-2 px-3 rounded-xl bg-[color:var(--solarized-background-highlight)] text-[color:var(--solarized-green)] text-xs"
          onChange={(e) => {
            setRefIndexes(
              fuse.search(e.target.value).map((item) => item.refIndex)
            )
          }}
        />
      </label>

      <div className="flex flex-wrap gap-0.5 mt-4">
        {data.map((tag, index) => {
          return (
            <Link key={tag.id} href={`/memo/search?tags=${tag.fields.select}`}>
              <a
                className={clsx(
                  'p-1 px-2 rounded-xl mb-[8px] hover:bg-[color:var(--solarized-background-highlight)] text-xs hover:text-[color:var(--solarized-violet)] ease-out duration-300',
                  {
                    'text-[color:var(--solarized-violet)]':
                      refIndexes.includes(index),
                    'bg-[color:var(--solarized-background-highlight)]':
                      refIndexes.includes(index),
                  }
                )}
              >
                #{tag.fields.select}
              </a>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const data = await getAllTags()

  return {
    props: {
      data,
    },
    revalidate: 60,
  }
}

export default Tagged
