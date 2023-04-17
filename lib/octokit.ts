import { graphql } from '@octokit/graphql'
import { Octokit } from '@octokit/rest'

const gql = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
})

export const octokit = new Octokit({
  baseUrl: 'https://api.github.com',
  auth: process.env.GITHUB_TOKEN,
})

export default gql
