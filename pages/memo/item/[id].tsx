import { serializeHandler } from '$lib/mdx'
import { getItem } from '@cbcruk/next-utils'
import Layout from '@/components/Layout'
import { MemoItem } from '@/components/Preview/MemoItem'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { MemoRecord } from '@/lib/types'

type Props = {
  data: MemoRecord
}

function MemoItemPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const keywords = data.fields.tags.join(', ')

  return (
    <Layout
      title={`메모`}
      description={`메모 키워드 - ${keywords}`}
      isShowTitle={false}
    >
      <MemoItem
        id={data.id}
        serialize={data.fields.serialize}
        tags={data.fields.tags}
        createdAt={data.fields.createdAt}
        lastModified={data.fields.lastModified}
        className="border-0"
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const data = await getItem<MemoRecord>({
    url: '/memo',
    id: params?.id as Parameters<typeof getItem>[0]['id'],
  })

  data.fields.serialize = await serializeHandler({
    source: data.fields.body,
    id: data.id,
  })

  return {
    props: {
      data,
    },
  }
}

export default MemoItemPage
