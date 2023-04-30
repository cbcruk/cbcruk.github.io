import { highlightElement } from '@/lib/highlight'

type Props = JSX.IntrinsicElements['div']

export function MemoHighlight({ children }: Props) {
  return (
    <div
      className="MemoHighlight"
      ref={(element) => {
        element?.querySelectorAll('pre code').forEach((code) => {
          highlightElement(code as HTMLElement)
        })
      }}
    >
      <style jsx>{`
        .MemoHighlight :global(pre) {
          margin: 0;
        }
      `}</style>
      {children}
    </div>
  )
}
