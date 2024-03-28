import type { Props } from '@components/Memo/MemoEmbedUrl.types'
import { MemoEmbedUrl as MemoEmbedUrlPrimitive } from './MemoPrimitive'

export function MemoEmbedUrl({ url }: Props) {
  const { host, href } = new URL(url)

  return (
    <MemoEmbedUrlPrimitive href={href} target="_blank" rel="noreferrer">
      {host}
    </MemoEmbedUrlPrimitive>
  )
}
