import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

async function md(req, res) {
  const links = req.body
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

  res.json({
    data: [...set].join('\n'),
  })
}

export default md
