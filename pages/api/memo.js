// @ts-check
import { octokit } from '../../lib/octokit'

/**
 *
 * @param {string} q
 */
export async function handler(q) {
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

/** @type {import('next').NextApiHandler} */
async function memo(req, res) {
  const { q } = req.query
  const data = await handler(/** @type {string} */ (q))

  res.json({
    data,
  })
}

export default memo
