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

  return result
}

function MemoSearch() {
  const { data, isLoading } = useMemoQuery()

  return (
    <Layout title="Memo" isShowTitle={false}>
      {(() => {
        if (!data) return null
        if (isLoading) return null
        return <Preview type="memo" items={data.records} />
      })()}
    </Layout>
  )
}

export default MemoSearch
