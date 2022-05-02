// @ts-check
import { getAllTags, setCacheAllTags } from '$lib/airtable'
import { getFile } from '$lib/file'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'

/**
 *
 * @param {object} props
 * @param {import('$lib/types').MemoRecord[]} props.data
 */
function Memos({ data }) {
  if (!data) {
    return null
  }

  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data} />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps({ params }) {
  const contents = await getFile({ fileName: `/[tagged]/${params.tag}` })
  const records = JSON.parse(contents)

  return {
    props: {
      data: records,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const allTags = await getAllTags()

  await setCacheAllTags(allTags)

  return {
    fallback: true,
    paths: allTags.map((tag) => {
      return {
        params: { tag: `${tag.fields.select}` },
      }
    }),
  }
}

export default Memos
