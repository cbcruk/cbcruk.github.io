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

async function main() {
  try {
    const nextIndex = await getNextIndex()
    const formattedTime = getFormattedTime()

    await fs.writeFile(
      `src/content/memo/${nextIndex}.md`,
      `---
tags: []
status: draft
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
