import { serializeHandler } from '$lib/mdx'
import { getItem, getList, releaseFormula } from '@cbcruk/next-utils'
import Layout from 'components/Layout'
import { MemoItem } from 'components/Preview/MemoItem'

function MemoItemPage({ data }) {
  return (
    <Layout title="Memo" isShowTitle={false}>
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

export async function getStaticProps({ params }) {
  const data = await getItem({ url: '/memo', id: params.id })

  data.fields.serialize = await serializeHandler({
    source: data.fields.body,
    id: data.id,
  })

  return {
    props: {
      data,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const data = await getList({
    url: '/memo',
    params: {
      filterByFormula: releaseFormula(),
      sort: [{ field: 'lastModified', direction: 'desc' }],
      fields: ['index'],
      pageSize: 100,
    },
  })
  const paths = data.records.map((item) => {
    return {
      params: { id: item.id },
    }
  })

  return {
    fallback: 'blocking',
    paths,
  }
}

export default MemoItemPage
