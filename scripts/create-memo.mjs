import fs from 'node:fs/promises'
import { format } from '@formkit/tempo'
import fg from 'fast-glob'

async function getNextIndex() {
  const entries = await fg.glob('./src/content/memo/*.{md,mdx}')
  const [latest] = entries
    .map((entry) => {
      const [, id] = entry.match(/\/(\d+)\.(md|mdx)$/)
      return id
    })
    .toSorted((a, b) => b - a)

  const nextIndex = parseInt(latest, 10) + 1

  return nextIndex
}

function getFormattedTime() {
  const time = format(new Date(), 'YYYY-MM-DD')

  return time
}

const TYPES = ['bookmarks', 'snippet', 'note']

function getType() {
  const [type = 'note'] = process.argv.slice(2)

  if (!TYPES.includes(type)) {
    throw new Error(`type 은 ${TYPES.join(' | ')} 중 하나여야 한다: ${type}`)
  }

  return type
}

async function main() {
  try {
    const nextIndex = await getNextIndex()
    const formattedTime = getFormattedTime()
    const type = getType()

    await fs.writeFile(
      `src/content/memo/${nextIndex}.md`,
      `---
type: ${type}
tags: []
status: ${type === 'bookmarks' ? 'archive' : 'draft'}
ctime: ${formattedTime}
mtime: ${formattedTime}
---

      `
    )

    console.log(`${nextIndex}.md`)
  } catch (error) {
    console.error(error)
  }
}
main()
