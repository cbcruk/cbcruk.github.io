// @ts-check
import { getMemo } from '$lib/airtable'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { Pagination } from 'components/Pagination'

/**
 * @param {object} props
 * @param {import('$lib/types').MemoRecord[]} props.data
 */
function Memos({ data }) {
  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data} />
      <Pagination pagination={[null, 2, null]} />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const { records } = await getMemo()

  return {
    props: {
      data: records,
    },
    revalidate: 60,
  }
}

export default Memos
