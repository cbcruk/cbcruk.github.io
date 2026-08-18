import type { ComponentProps } from 'react'
import { MemoBody } from './MemoBody'
import type { CollectionEntry } from 'astro:content'

export type Category = 'memo' | 'think'

export type Props = {
  type?: Category
  raw?: boolean
  memo: CollectionEntry<Category>
  children: ComponentProps<typeof MemoBody>['children']
}
