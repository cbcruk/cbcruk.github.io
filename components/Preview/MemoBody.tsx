import clsx from 'clsx'
import styles from './MemoBody.module.css'

type Props = JSX.IntrinsicElements['div']

export function MemoBody({ children }: Props) {
  return (
    <div
      className={clsx(styles.container, [
        'prose prose-sm prose-dark max-w-full p-4 text-xs',
      ])}
    >
      {children}
    </div>
  )
}
