import { NextApiRequest, NextApiResponse } from 'next'
import { octokit } from '../../lib/octokit'

export async function handler(q: string) {
  const { data } = await octokit.rest.search.issuesAndPullRequests({
    q: `is:issue repo:cbcruk/issues ${q}`,
  })
  const items = data.items.map(({ number, title, body }) => ({
    number,
    title,
    bodyText: body ? body.slice(0, body.indexOf(`\r\n`)) : '',
  }))

  return items
}

async function memo(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query
  const data = await handler(q as string)

  res.json({
    data,
  })
}

export default memo
