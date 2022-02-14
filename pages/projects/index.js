// @ts-check
import Layout from '../../components/Layout'
import Preview from '../../components/Preview'
import gql from '../../lib/octokit'

/**
 *
 * @param {object} props
 * @param {import('@octokit/graphql-schema').Issue[]} props.data
 */
function Projects({ data }) {
  return (
    <Layout title="프로젝트">
      <Preview type="projects" items={data} />
    </Layout>
  )
}

/** @type {import('next').GetServerSideProps} */
export async function getServerSideProps() {
  /** @type {{ repository: import('@octokit/graphql-schema').Repository }} */
  const { repository } = await gql(
    `
      {
        repository(owner: "cbcruk", name: "issues") {
          issues(last: 10, filterBy: { labels: "project" }, orderBy: { direction: DESC, field: UPDATED_AT }) {
            nodes {
              number
              title
              bodyText
              createdAt
              updatedAt
            }
          }
        }
      }
    `
  )

  return {
    props: {
      data: repository.issues.nodes,
    },
  }
}

export default Projects
