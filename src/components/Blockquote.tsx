import type { ComponentProps, PropsWithChildren } from 'react'

type Cite = {
  url?: string
  title?: string
}

type BlockquoteProps = {
  cite: Cite
}

type LinkOrNotProps = ComponentProps<'a'>

function LinkOrNot({ href, children }: LinkOrNotProps) {
  if (href) {
    const url = new URL(href)

    return (
      <a href={href} target="_blank">
        {children} ({url.host})
      </a>
    )
  }

  return children
}

export function Blockquote({
  cite,
  children,
}: PropsWithChildren<BlockquoteProps>) {
  return (
    <blockquote cite={cite.url} className="relative">
      <div className="flex flex-col gap-1">
        <span className="text-lg select-none">💡</span>
        {children}
        <footer className="italic">
          <LinkOrNot href={cite.url} target="_blank">
            <cite>-{cite.title}</cite>
          </LinkOrNot>
        </footer>
      </div>
    </blockquote>
  )
}
