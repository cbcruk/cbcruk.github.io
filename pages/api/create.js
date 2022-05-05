import fs from 'fs/promises'
import {
  getAllMemo,
  getAllTags,
  setCacheAllMemo,
  setCacheAllTags,
} from '$lib/airtable'

/** @type {import('next').NextApiHandler} */
async function create(_req, res) {
  if (process.env.NODE_ENV === 'production') {
    res.send(500)
    return
  }

  await fs.rm('.cached', { recursive: true, force: true })
  await fs.mkdir('.cached/[page]', { recursive: true })
  await fs.mkdir('.cached/[tagged]', { recursive: true })

  const records = await getAllMemo()
  await setCacheAllMemo(records)
  const allTags = await getAllTags()
  await setCacheAllTags(allTags)

  res.send('✅')
}

export default create
