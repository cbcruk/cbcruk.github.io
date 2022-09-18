import { getAllTags } from '$lib/airtable'
import Link from 'next/link'
import Layout from '../../components/Layout'

/**
 * @param {object} props
 * @param {import('$lib/types').TagRecord[]} props.data
 */
function Tagged({ data }) {
  return (
    <Layout title="Tagged" isShowTitle={false}>
      <div className="flex flex-wrap gap-2">
        {data.map((tag) => {
          return (
            <Link key={tag.id} href={`/memo/search?tags=${tag.fields.select}`}>
              <a className="p-2 px-3 border border-slate-700 hover:border-transparent rounded-lg mb-[8px] text-xs hover:font-bold hover:bg-[color:var(--solarized-background-highlight)] hover:text-[color:var(--solarized-violet)] ease-out duration-300">
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
