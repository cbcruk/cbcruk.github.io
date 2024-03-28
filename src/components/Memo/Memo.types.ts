import type { ComponentProps } from 'react'
import { MemoBody } from './MemoBody'
import type { CollectionEntry } from 'astro:content'

export type Props = {
  memo: CollectionEntry<'memo'>
  children: ComponentProps<typeof MemoBody>['children']
}
