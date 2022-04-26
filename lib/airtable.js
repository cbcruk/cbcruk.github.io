// @ts-check
import fetch from 'node-fetch'
import { mdxSerialize } from './mdx'

export const airtable = (() => {
  const baseURL = process.env.AIRTABLE_URL
  const defaultHeaders = {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
  }
  const defaultParams = {
    view: 'Grid view',
  }

  return {
    get: async (url, { params = {}, headers = {} }) => {
      const searchParams = new URLSearchParams()

      Object.entries({
        ...defaultParams,
        ...params,
      }).forEach(([key, value]) => {
        searchParams.append(key, `${value}`)
      })

      const query = searchParams.toString()
      const response = await fetch(`${baseURL + url}?${query}`, {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      })
      /** @type {object} */
      const data = await response.json()

      return { data }
    },
  }
})()

/**
 * @param {object} params
 */
export async function getMemo(params = {}) {
  /** @type {{ data: { records: import('$lib/types').MemoRecord[], offset: string } }} */
  const response = await airtable.get('/memo', {
    params: {
      pageSize: 20,
      'sort[0][field]': 'lastModified',
      'sort[0][direction]': 'desc',
      filterByFormula: `AND({release})`,
      ...params,
    },
  })

  await mdxSerialize(response.data.records)

  return response.data
}

export async function getAllMemo() {
  const records = []
  const offset = { current: '' }

  do {
    const data = await getMemo({ offset: offset.current })

    records.push(data.records)

    offset.current = data.offset
  } while (offset.current)

  return records
}

export async function getTags(params = {}) {
  /** @type {{ data: { records: import('$lib/types').TagRecord[], offset: string } }} */
  const response = await airtable.get('/tags', {
    params: {
      pageSize: 20,
      'sort[0][field]': 'count',
      'sort[0][direction]': 'desc',
      'fields[]': 'select',
      ...params,
    },
  })

  return response.data
}

export async function getAllTags() {
  const records = []
  const offset = { current: '' }

  do {
    const data = await getTags({ offset: offset.current })

    records.push(data.records)

    offset.current = data.offset
  } while (offset.current)

  return records.flatMap((r) => r)
}
