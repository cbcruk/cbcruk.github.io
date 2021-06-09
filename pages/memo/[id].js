import Detail from '../../components/Detail'
import Layout from '../../components/Layout'
import gql from '../../lib/octokit'

function Memo({ data }) {
  const { title, bodyHTML, comments } = data

  return (
    <Layout title={title}>
      <Detail body={bodyHTML} comments={comments.nodes} />
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const id = parseInt(params.id, 10)

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
