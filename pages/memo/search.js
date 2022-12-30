import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import Layout from 'components/Layout'
import Preview from 'components/Preview'

function useMemoQuery() {
  const router = useRouter()
  const tags = router.query.tags
  const result = useQuery(
    ['memo', tags],
    async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('tags', tags)
      const search = searchParams.toString()
      const response = await fetch(`/api/memo?${search}`)
      const data = await response.json()

      return data.data
    },
    {
      enabled: Boolean(tags),
    }
  )

  return { ...result, tags }
}

function MemoSearch() {
  const { data, tags, isLoading } = useMemoQuery()

  return (
    <Layout title={`메모 검색 ${tags || ''}`} isShowTitle={false}>
      {(() => {
        if (isLoading) return <p>불러오는 중...</p>
        if (!data) return null
        return <Preview type="memo" items={data.records} />
      })()}
    </Layout>
  )
}

export default MemoSearch
