import { getMemo } from '$lib/airtable'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { PaginationLatest } from '@/components/Pagination/PaginationLatest'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { MemoPageProps } from '@/lib/types'
import { serializeHandler } from '@/lib/mdx'

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
  const [data] = await Promise.all([
    getMemo({
      sort: [{ field: 'lastModified', direction: 'desc' }],
      pageSize: 10,
    }),
  ])

  for (const record of data.records) {
    record.fields.serialize = await serializeHandler({
      source: record.fields.body,
      id: record.id,
    })

    delete record.fields.body
  }

  return {
    props: {
      data: {
        records: data.records,
      },
    },
    revalidate: 60,
  }
}

export default Memos
