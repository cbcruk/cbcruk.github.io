import clsx from 'clsx'
import classes from './HighlightLinks.module.css'

export function HighlightLinks({ children }) {
  return (
    <ul className={clsx(['flex gap-2 mt-2 text-sm', classes.wrapper])}>
      {children}
    </ul>
  )
}
