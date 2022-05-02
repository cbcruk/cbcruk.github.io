// @ts-check
import { getAllMemo, setCacheAllMemo } from '$lib/airtable'
import { getFile } from '$lib/file'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { Pagination } from 'components/Pagination'

/**
 * @param {object} props
 * @param {{ records, pagination }} props.data
 */
function Memos({ data }) {
  if (!data) {
    return null
  }

  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data.records} />
      <Pagination pagination={data.pagination} />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps({ params }) {
  const contents = await getFile({ fileName: `/[page]/${params.page}` })
  const data = JSON.parse(contents)

  return {
    props: { data },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const records = await getAllMemo()
  const paths = await setCacheAllMemo(records)

  return {
    fallback: true,
    paths: paths.map((page) => {
      return {
        params: { page: `${page}` },
      }
    }),
  }
}

export default Memos
