// @ts-check
import { getLastIndex, getLastPage } from '@cbcruk/next-utils'
import { getMemo } from '$lib/airtable'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { PaginationLatest } from 'components/Pagination/PaginationLatest'
import 'highlight.js/styles/base16/tomorrow-night.css'

/**
 * @param {import('$lib/types').MemoPageProps} props
 */
function Memos({ data }) {
  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data.records} />
      <PaginationLatest />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  const [total, data] = await Promise.all([
    getLastIndex('/memo'),
    getMemo({
      sort: [{ field: 'lastModified', direction: 'desc' }],
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
