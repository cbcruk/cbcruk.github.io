import { serializeHandler } from '$lib/mdx'
import { getItem } from '@cbcruk/next-utils'
import Layout from 'components/Layout'
import { MemoItem } from 'components/Preview/MemoItem'

function MemoItemPage({ data }) {
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

export async function getServerSideProps({ params }) {
  const data = await getItem({ url: '/memo', id: params.id })

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
