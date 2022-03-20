// @ts-check
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import { useRegister } from '../../hooks/useRegister'
import gql from '../../lib/octokit'

/**
 *
 * @param {object} props
 * @param {import('@octokit/graphql-schema').Issue[]} props.data
 */
function Memos({ data }) {
  useRegister(data)

  return (
    <Layout title="Memo" isShowTitle={false}>
      <Preview type="memo" items={data} />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps() {
  /** @type {{ repository: import('@octokit/graphql-schema').Repository }} */
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
    revalidate: 60,
  }
}

export default Memos
