import clsx from 'clsx'
import styles from './HighlightLink.module.css'

export function HighlightLink({ children, ...props }) {
  return (
    <a
      {...props}
      className={clsx(styles.root, 'relative no-underline cursor-pointer')}
    >
      {children}
    </a>
  )
}
