import { useState } from 'react'
import Fuse from 'fuse.js'
import memos from '@data/memos_fts.json'

export function useFuse() {
  const [fuse] = useState(
    () =>
      new Fuse(memos, {
        minMatchCharLength: 2,
        keys: ['body', 'data.tags'],
        includeMatches: true,
        includeScore: true,
        threshold: 0.3,
      })
  )

  return fuse
}
