import { ComponentProps, PropsWithChildren } from 'react'

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
    return (
      <a href={href} target="_blank">
        {children}
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
    <blockquote cite={cite.url} className="flex flex-col gap-1">
      {children}
      <footer class="italic">
        <LinkOrNot href={cite.url} target="_blank">
          <cite>-{cite.title}</cite>
        </LinkOrNot>
      </footer>
    </blockquote>
  )
}
