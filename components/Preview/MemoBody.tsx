// @ts-check
import clsx from 'clsx'
import { MDXRemote } from 'next-mdx-remote'
import styles from './MemoBody.module.css'

export function MemoBody({ serialize }) {
  return (
    <div
      className={clsx(styles.container, [
        'prose prose-sm prose-dark max-w-full p-4 text-xs',
      ])}
    >
      <MDXRemote {...serialize} />
    </div>
  )
}
