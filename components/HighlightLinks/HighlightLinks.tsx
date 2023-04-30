import clsx from 'clsx'
import classes from './HighlightLinks.module.css'

type Props = JSX.IntrinsicElements['ul']

export function HighlightLinks({ children }: Props) {
  return (
    <ul className={clsx(['flex gap-2 mt-2 text-sm', classes.wrapper])}>
      {children}
    </ul>
  )
}
