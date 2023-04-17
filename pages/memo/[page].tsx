import {
  getLastIndex,
  getLastPage,
  getPagination,
  paginationFormula,
} from '@cbcruk/next-utils'
import { getMemo } from '$lib/airtable'
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { Pagination } from '@/components/Pagination'
import { useRouter } from 'next/router'
import { MemoPageProps } from '@/lib/types'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'

type Props = MemoPageProps

function Memos({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const page = router.query.page

  if (!data) {
    return null
  }

  return (
    <Layout title={`메모 리스트 ${page}페이지`} isShowTitle={false}>
      <Preview items={data.records} />
      <Pagination pagination={data.pagination} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { page, startIndex, endIndex } = getPagination(params?.page as string)
  const [total, data] = await Promise.all([
    getLastIndex('/memo'),
    getMemo({
      filterByFormula: paginationFormula({ start: startIndex, end: endIndex }),
      sort: [{ field: 'index', direction: 'asc' }],
    }),
  ])

  if (!data) {
    return {
      notFound: true,
    }
  }

  if (page === 0) {
    return {
      redirect: {
        destination: '/memo',
        permanent: false,
      },
    }
  }

  return {
    props: {
      data: {
        records: data.records,
        pagination: [page - 1, page + 1, getLastPage(total)],
      },
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const total = await getLastIndex('/memo')
  const paths = Array.from({ length: getLastPage(total) }).map((_, index) => {
    return {
      params: { page: `${index + 2}` },
    }
  })

  return {
    fallback: 'blocking',
    paths,
  }
}

export default Memos
