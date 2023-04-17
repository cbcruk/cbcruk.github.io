import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { match, P } from 'ts-pattern'
import Preview from '@/components/Preview'
import Layout from '@/components/Layout'

async function fetchMemo(tags: string) {
  const searchParams = new URLSearchParams()
  searchParams.append('tags', tags)
  const search = searchParams.toString()
  const { data } = await axios.get(`/api/memo?${search}`).catch((e) => {
    throw new Error(e.response.data.message)
  })

  return data
}

function useMemoQuery() {
  const router = useRouter()
  const tags = router.query.tags
  const result = useQuery(['memo', tags], () => fetchMemo(tags as string), {
    enabled: Boolean(tags),
    retry: 0,
  })

  return { ...result, tags }
}

function MemoSearch() {
  const { data, tags, isLoading, isError } = useMemoQuery()

  return (
    <Layout title={`메모 검색 - ${tags || ''}`} isShowTitle={false}>
      {match({ isLoading, isError, data })
        .with({ isLoading: true }, () => <p>불러오는 중...</p>)
        .with({ isError: true }, () => <p>에러가 발생했습니다.</p>)
        .with({ data: P.nullish }, () => null)
        .otherwise(() => (
          <Preview items={data.records} />
        ))}
    </Layout>
  )
}

export default MemoSearch
