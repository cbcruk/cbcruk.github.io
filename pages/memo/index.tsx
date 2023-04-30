import { getLastIndex, getLastPage } from '@cbcruk/next-utils'
import { getMemo } from '$lib/airtable'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { PaginationLatest } from '@/components/Pagination/PaginationLatest'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { MemoPageProps } from '@/lib/types'

type Props = MemoPageProps

function Memos({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout title="메모 최근 리스트" isShowTitle={false}>
      <Preview items={data.records} />
      <PaginationLatest />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
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
