import { graphql } from '@octokit/graphql'

const gql = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
})

export default gql
