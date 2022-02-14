// @ts-check
import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

/** @type {import('next').NextApiHandler} */
async function md(req, res) {
  /** @type {string} */
  const body = req.body
  const links = body
    .split('\n')
    .filter(Boolean)
    .map((link) => link.replace('?utm_source=pocket_mylist', ''))
  /** @type {Set<string>} */
  const set = new Set()

  for (const link of links) {
    const response = await fetch(link)
    const data = await response.text()
    const root = parse(data)
    const title = root.querySelector('title')?.textContent.trim()
    const md = `[${title}](${link})`

    set.add(md)
  }

  res.json({
    data: Array.from(set).join('\n'),
  })
}

export default md
