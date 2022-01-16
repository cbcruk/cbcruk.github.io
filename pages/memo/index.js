import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { useRegister } from '../../hooks/useRegister'
import gql from '../../lib/octokit'
import { handler as memoHandler } from '../api/memo'

function Memos({ data }) {
  useRegister(data)

  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data} />
    </Layout>
  )
}

export async function getServerSideProps({ query }) {
  const { q } = query

  if (q) {
    const data = await memoHandler(q)

    return {
      props: {
        data,
      },
    }
  }

  const { repository } = await gql(
    `
      {
        repository(owner: "cbcruk", name: "issues") {
          issues(last: 100, filterBy: { labels: "memo" }, orderBy: { direction: DESC, field: UPDATED_AT }) {
            nodes {
              number
              title
              bodyText
              createdAt
              updatedAt
              comments {
                totalCount
              }
            } 
            pageInfo {
              startCursor
              hasPreviousPage
              hasNextPage
              endCursor
            }
          }
        }
      }
    `
  )

  return {
    props: {
      data: repository.issues.nodes.map((node) => {
        const [bodyTextSummary] = node.bodyText.split('\n')

        return {
          ...node,
          bodyText: bodyTextSummary,
        }
      }),
    },
  }
}

export default Memos
