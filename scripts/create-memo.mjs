import fs from 'node:fs/promises'
import { format } from '@formkit/tempo'
import fg from 'fast-glob'

async function getNextIndex() {
  const entries = await fg.glob('./src/content/memo/*.{md,mdx}')
  const nextIndex = entries.length + 1

  return nextIndex
}

function getFormattedTime() {
  const time = format(new Date(), 'YYYY-MM-DD')

  return time
}

async function main() {
  const nextIndex = await getNextIndex()
  const formattedTime = getFormattedTime()

  await fs.writeFile(
    `src/content/memo/${nextIndex}.md`,
    `---
tags: []
status: release
ctime: ${formattedTime}
mtime: ${formattedTime}
---


  `
  )
}
main()
