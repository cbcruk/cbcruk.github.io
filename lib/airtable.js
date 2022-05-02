// @ts-check
import { getList, getListAll } from '@cbcruk/airtable'
import { getFile, isExist, writeFile } from './file'
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
  if (process.env.NODE_ENV === 'development') {
    const cached = await isExist('allmemo')

    if (cached) {
      const data = await getFile({ fileName: 'allmemo' })
      return JSON.parse(data)
    }
  }

  const data = await getListAll(getMemo)
  await writeFile({
    fileName: 'allmemo',
    data: JSON.stringify(data),
  })

  return data
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
  if (process.env.NODE_ENV === 'development') {
    const cached = await isExist('alltags')

    if (cached) {
      const data = await getFile({ fileName: 'alltags' })
      return JSON.parse(data).flatMap((r) => r)
    }
  }

  const data = await getListAll(getTags)
  await writeFile({
    fileName: 'alltags',
    data: JSON.stringify(data),
  })

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
