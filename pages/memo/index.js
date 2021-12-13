import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import gql from '../../lib/octokit'

function Memos({ data }) {
  return (
    <Layout title="Memo">
      <Preview type="memo" items={data} />
    </Layout>
  )
}

export async function getServerSideProps() {
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
