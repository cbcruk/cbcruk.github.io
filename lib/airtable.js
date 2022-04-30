// @ts-check
import { getList, getListAll } from '@cbcruk/airtable'
import { mdxSerialize } from './mdx'

export async function getMemo(params = {}) {
  /** @type {import('@cbcruk/airtable').AirtableResponse<import('$lib/types').MemoRecord>} */
  const data = await getList({
    url: '/memo',
    params: {
      pageSize: 20,
      'sort[0][field]': 'lastModified',
      'sort[0][direction]': 'desc',
      filterByFormula: `AND({release})`,
      ...params,
    },
  })

  await mdxSerialize(data.records)

  return data
}

export async function getAllMemo() {
  const data = await getListAll(getMemo)
  return data
}

export async function getTags(params = {}) {
  /** @type {import('@cbcruk/airtable').AirtableResponse<import('$lib/types').TagRecord>} */
  const data = await getList({
    url: '/tags',
    params: {
      pageSize: 20,
      'sort[0][field]': 'count',
      'sort[0][direction]': 'desc',
      'fields[]': 'select',
      ...params,
    },
  })

  return data
}

export async function getAllTags() {
  const data = await getListAll(getTags)
  return data.flatMap((r) => r)
}
