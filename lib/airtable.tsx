// @ts-check
import {
  getList,
  getListAll,
  releaseFormula,
  writeFile,
} from '@cbcruk/next-utils'
import { mdxSerialize } from './mdx'

export async function getMemo(params = {}) {
  /** @type {import('@cbcruk/next-utils').AirtableResponse<import('$lib/types').MemoRecord>} */
  const data = await getList({
    url: '/memo',
    params: {
      filterByFormula: releaseFormula(),
      ...params,
    },
  })
  await mdxSerialize(data.records)

  return data
}

export async function getAllMemo() {
  const data = await getListAll(getMemo)

  return data.flatMap((r) => r)
}

export async function setCacheAllMemo(records) {
  const paths = []

  for (const record of records) {
    const total = records.length
    const index = paths.length + 1
    const prev = index === 1 ? null : index - 1
    const next = index === total ? null : index + 1
    const pagination = [prev, next, total]

    await writeFile({
      fileName: `/[page]/${index}`,
      data: JSON.stringify({
        records: record,
        pagination,
      }),
    })

    paths.push(index)
  }

  return paths
}

export async function getTags(params = {}) {
  /** @type {import('@cbcruk/next-utils').AirtableResponse<import('$lib/types').TagRecord>} */
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

export async function setCacheAllTags(allTags) {
  const allMemo = await getAllMemo()

  await writeFile({
    fileName: 'alltags',
    data: JSON.stringify(allTags),
  })

  for (const tag of allTags) {
    const data = allMemo
      .flatMap((r) => r)
      .filter((memo) => memo.fields.tags.includes(tag.fields.select))

    await writeFile({
      fileName: `/[tagged]/${tag.fields.select}`,
      data: JSON.stringify(data),
    })
  }
}
