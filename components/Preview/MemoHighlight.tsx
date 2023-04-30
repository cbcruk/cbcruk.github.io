import { highlightElement } from '@/lib/highlight'

type Props = JSX.IntrinsicElements['div']

export function MemoHighlight({ children }: Props) {
  return (
    <div
      ref={(element) => {
        element?.querySelectorAll('pre code').forEach((code) => {
          highlightElement(code as HTMLElement)
        })
      }}
    >
      {children}
    </div>
  )
}
