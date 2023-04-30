import { getMemo } from '$lib/airtable'
import { mdxSerialize, serializeHandler } from '$lib/mdx'
import { releaseFormula } from '@cbcruk/next-utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { match, P } from 'ts-pattern'

export async function getMemoByTags(tags: string) {
  const data = await getMemo({
    filterByFormula: `AND(SEARCH('${tags}', {tags}), ${releaseFormula()})`,
    pageSize: 100,
  })

  return data
}

async function memo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await match(req.query)
      .with({ tags: P.string }, ({ tags }) => getMemoByTags(tags))
      .otherwise(() => null)

    if (!data) {
      res.status(400).json({
        message:
          '잘못된 요청입니다. 요청이 유효하지 않거나 부적절합니다. 요청을 확인하고 다시 시도해주세요.',
      })

      return
    }

    if (data.records.length === 0) {
      res.status(404).json({
        message: '검색 결과가 없습니다.',
      })

      return
    }

    for (const record of data.records) {
      record.fields.serialize = await serializeHandler({
        source: record.fields.body,
        id: record.id,
      })

      delete record.fields.body
    }

    res.setHeader('Cache-Control', 's-maxage=3600')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).end()
  }

  return
}

export default memo
