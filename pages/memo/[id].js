// @ts-check
import Detail from '../../components/Detail'
import Layout from '../../components/Layout'
import gql from '../../lib/octokit'

/**
 *
 * @param {object} props
 * @param {import('@octokit/graphql-schema').Issue} props.data
 */
function Memo({ data }) {
  const { title, bodyHTML, comments } = data

  return (
    <Layout title={title}>
      <Detail body={bodyHTML} comments={comments.nodes} />
    </Layout>
  )
}

/** @type {import('next').GetServerSideProps} */
export async function getServerSideProps({ params }) {
  const id = parseInt(/** @type {string} */ (params.id), 10)

  /** @type {{ repository: import('@octokit/graphql-schema').Repository }} */
  const { repository } = await gql(
    `
      {
        repository(owner: "cbcruk", name: "issues") {
          issue(number: ${id}) {
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
  }
}

export default Memo
