// @ts-check
import fetch from 'node-fetch'

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
      ...params,
    },
  })

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
