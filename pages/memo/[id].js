import Detail from '../../components/Detail'
import Layout from '../../components/Layout'
import gql from '../../lib/octokit'

/**
 *
 * @param {object} props
 * @param {import('@octokit/graphql-schema').Issue} props.data
 */
function Memo({ data }) {
  if (!data) {
    return null
  }

  const { title, bodyHTML, comments } = data

  return (
    <Layout title={title}>
      <Detail body={bodyHTML} comments={comments.nodes} />
    </Layout>
  )
}

/** @type {import('next').GetStaticProps} */
export async function getStaticProps({ params }) {
  /** @type {{ repository: import('@octokit/graphql-schema').Repository }} */
  const { repository } = await gql(
    `
      {
        repository(owner: "cbcruk", name: "issues") {
          issue(number: ${params.id}) {
            title
            bodyHTML
            createdAt
            updatedAt
            comments(first: 10) {
              nodes {
                databaseId
                bodyHTML
              }
            }
          }
        }
      }
    `
  )

  return {
    props: {
      data: repository.issue,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  /** @type {{ repository: import('@octokit/graphql-schema').Repository }} */
  const { repository } = await gql(
    `
      {
        repository(owner: "cbcruk", name: "issues") {
          issues(last: 100, filterBy: { labels: "memo" }, orderBy: { direction: DESC, field: UPDATED_AT }) {
            nodes {
              number
            }
          }
        }
      }
    `
  )
  const paths = repository.issues.nodes.map((node) => {
    return { params: { id: `${node.number}` } }
  })

  return {
    fallback: true,
    paths,
  }
}

export default Memo
