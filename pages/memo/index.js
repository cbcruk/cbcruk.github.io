// @ts-check
import {
  getLastIndex,
  getLastPage,
  paginationFormula,
} from '@cbcruk/next-utils'
import { getMemo } from '$lib/airtable'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { Pagination } from 'components/Pagination'

/**
 * @param {import('$lib/types').MemoPageProps} props
 */
function Memos({ data }) {
  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data.records} />
      <Pagination pagination={data.pagination} />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const [total, data] = await Promise.all([
    getLastIndex('/memo'),
    getMemo({
      filterByFormula: paginationFormula({ start: 1, end: 20 }),
    }),
  ])

  return {
    props: {
      data: {
        records: data.records,
        pagination: [null, 2, getLastPage(total)],
      },
    },
    revalidate: 60,
  }
}

export default Memos
