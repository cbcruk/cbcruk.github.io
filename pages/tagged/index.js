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
            <Link key={tag.id} href={`/tagged/${tag.fields.select}`}>
              <a className="p-1 px-2 border border-slate-600 hover:border-slate-500 rounded-2xl hover:bg-purple-800/50 text-xs">
                {tag.fields.select}
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
