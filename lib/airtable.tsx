import { getList, getListAll, releaseFormula } from '@cbcruk/next-utils'
import { MemoRecord } from './types'

export async function getMemo(params = {}) {
  const data = await getList<MemoRecord>({
    url: '/memo',
    params: {
      filterByFormula: releaseFormula(),
      ...params,
    },
  })

  return data
}

export async function getTags(params = {}) {
  const data = await getList({
    url: '/tags',
    params: {
      sort: [{ field: 'count', direction: 'desc' }],
      fields: ['select', 'count'],
      ...params,
    },
  })

  return data
}

export async function getAllTags() {
  const data = await getListAll(getTags)

  return data.flatMap((r) => r)
}
