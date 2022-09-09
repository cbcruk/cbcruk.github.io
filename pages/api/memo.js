// @ts-check
import { getMemo } from '$lib/airtable'
import { mdxSerialize } from '$lib/mdx'
import { releaseFormula } from '@cbcruk/next-utils'

/**
 *
 * @param {string} tags
 */
export async function handler(tags) {
  try {
    const data = await getMemo({
      filterByFormula: `AND(SEARCH('${tags}', {tags}), ${releaseFormula()})`,
      pageSize: 100,
    })

    await mdxSerialize(data.records)

    return data
  } catch (error) {
    console.log(error)
  }
}

/** @type {import('next').NextApiHandler} */
async function memo(req, res) {
  const { tags } = req.query
  const data = await handler(/** @type {string} */ (tags))

  res.status(200).json({
    data,
  })

  return
}

export default memo
