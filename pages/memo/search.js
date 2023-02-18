import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import Layout from 'components/Layout'
import Preview from 'components/Preview'
import axios from 'axios'
import { match, P } from 'ts-pattern'

async function fetchMemo(tags) {
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
  const result = useQuery(['memo', tags], () => fetchMemo(tags), {
    enabled: Boolean(tags),
    retry: 0,
  })

  return { ...result, tags }
}

function MemoSearch() {
  const { data, tags, isLoading, isError, error } = useMemoQuery()

  return (
    <Layout title={`메모 검색 - ${tags || ''}`} isShowTitle={false}>
      {match({ isLoading, isError, data })
        .with({ isLoading: true }, () => <p>불러오는 중...</p>)
        .with({ isError: true }, () => <p>{error?.message}</p>)
        .with({ data: P.nullish }, () => null)
        .otherwise(() => (
          <Preview type="memo" items={data.records} />
        ))}
    </Layout>
  )
}

export default MemoSearch
