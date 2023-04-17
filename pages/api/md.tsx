import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

interface NextApiRequestExtended extends NextApiRequest {
  body: {
    data: string
  }
}

async function md(req: NextApiRequestExtended, res: NextApiResponse) {
  const body = req.body.data
  const links = body
    .split('\n')
    .filter(Boolean)
    .map((link) => link.replace('?utm_source=pocket_mylist', ''))
  const set = new Set()

  for (const link of links) {
    const response = await fetch(link)
    const data = await response.text()
    const root = parse(data)
    const title = root.querySelector('title')?.textContent.trim()
    const md = `[${title}](${link})`

    set.add(md)
  }

  res.json(Array.from(set).join('\n'))

  return
}

export default md
