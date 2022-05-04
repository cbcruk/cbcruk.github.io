import fs from 'fs/promises'
import {
  getAllMemo,
  getAllTags,
  setCacheAllMemo,
  setCacheAllTags,
} from '$lib/airtable'

export default () => null

export async function getStaticProps() {
  await fs.rm('.cached', { recursive: true, force: true })
  await fs.mkdir('.cached/[page]', { recursive: true })
  await fs.mkdir('.cached/[tagged]', { recursive: true })

  const records = await getAllMemo()
  await setCacheAllMemo(records)
  const allTags = await getAllTags()
  await setCacheAllTags(allTags)

  return {
    props: {},
  }
}
