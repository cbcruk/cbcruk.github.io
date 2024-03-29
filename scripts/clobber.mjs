import fs from 'node:fs/promises'
import fg from 'fast-glob'

async function main() {
  const entries = await fg.glob('./src/content/memo/*.md')

  for (const entry of entries) {
    const [_, id] = entry.match(/(\d+).md/)
    const data = await fs.readFile(entry, 'utf-8')
    const nextData = data.replace(/\[\^(\d+)\]/g, (_m, p1) => `[^${id}-${p1}]`)

    await fs.writeFile(entry, nextData, 'utf-8')
  }
}
main()